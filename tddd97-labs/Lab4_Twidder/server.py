from flask import Flask, render_template, request
from database_helper import *
import sqlite3
import init_db
import re
from flask_jwt_extended import JWTManager
from flask_sock import Sock

 
app = Flask(__name__)
app.secret_key = 'top_secret'
jwt = JWTManager(app)

# Sock
sock = Sock(app)

active_sessions = {}
print("active sessions before login" , active_sessions)

# Sock 
@sock.route('/login')
def handle_login(ws):
    while True:
        message = ws.receive()  # Receive message from the client
        email = checkTokenInDb(message)[0]
        if message == 'close':
            ws.close()
            break  # Close the socket connection if 'close' message is received
        elif email in active_sessions:
            old_session_obj = active_sessions[email]
            old_session_obj.close()
            active_sessions.pop(email) 
        active_sessions[email] = ws

@app.teardown_appcontext
def teardown_appcontext(error):
    close_db(error)

"""
def validateToken(token):
    if token is None:
        return False
    
    return checkTokenInDb(token)
"""

@app.route("/")
def welcome():
    print("Route welcome:", request.path)
    return render_template("client.html")



@app.route("/sign_in", methods=['POST'])
def sign_in(): 
    #200v, 400v, 401v, 405(wrong method caught by flask), 500v
    data = request.get_json()
    email = data['username']
    password = data['password']
    
    if request.method != 'POST':
        return jsonify({'success': False,'message': 'Bad Method'}), 405
  
    if password is None:
        return jsonify({'success': False,'message': 'Password is missing'}), 400
    if not check(email):
        return jsonify({'success': False,'message': 'The email does not follow a valid format'}), 400


    message = signInHelper(email, password)

    if message == 'No such user':
        return jsonify({'success': False, 'message': 'No such user'}), 401
    
    elif message == 'Wrong password':
        return jsonify({'success': False, 'message': 'Wrong password'}), 400
         
    else:
        return jsonify({'success': True, 'data': message}), 200
    
    return jsonify({'success': False,'message': "Unknown internal error"}), 500 # Internal error

@app.route("/sign_up", methods=['POST'])
def sign_up():
    if request.method != 'POST':
        return jsonify({'success': False,'message': 'Bad Method'}), 405
    #201v, 400v, 409v, 405, 500v
    
    data = request.get_json()
    email = data['email']
    password = data['password']
    firstname = data['firstname']
    familyname = data['familyname']
    gender = data['gender']
    city = data['city']
    country = data['country']

    if not check(email):
        return jsonify({ 'success': False, 'message': 'Email is invalid'}), 400
    if password is None:
        return jsonify({ 'success': False, 'message': 'Password is None'}), 400
    if firstname is None:
        return jsonify({ 'success': False, 'message': 'Firstname is None'}), 400  
    if familyname is None:
        return jsonify({ 'success': False, 'message': 'Familyname is None'}), 400  
    if gender is None:
         return jsonify({ 'success': False, 'message': 'Gender is None'}), 400  
    if country is None:
         return jsonify({ 'success': False, 'message': 'Country is None'}), 400  
    if city is None:
         return jsonify({ 'success': False, 'message': 'City is None'}), 400  

    success = signUpHelper(email, password, firstname, familyname, gender, country, city)
    
    if success:
         return jsonify({'success': True, 'message': 'User registered successfully'}), 201 # created
    else:
        return jsonify({ 'success': False, 'message': 'Email already taken'}), 409
    
    return jsonify({'success': False,'message': "Unknown internal error"}), 500 # Internal error

# Make a regular expression for validating an Email
regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'     

def check(email):
    if email is None:
        return False
    elif(re.fullmatch(regex, email)):
       return True
    else:
        return False

@app.route("/get_user_data_by_token", methods=['GET'])
def get_user_data_by_token():
    #200v, 401v, 405v, 500v
    if request.method != 'GET':
        return jsonify({'success': False,'message': 'Bad Method'}), 405

    token = request.headers.get('Authorization')
    
    if token is None:
        return jsonify({'success': False, 'message': "Missing token"}), 400 

    #user_data = validateToken(token)
    user_data = checkTokenInDb(token)

    if user_data == False:
        return jsonify({'success': False, 'message': "Incorrect token"}), 401

    else: 
       user = {'success': True, 
            'email': user_data[0],
            'firstname': user_data[2], 
            'familyname': user_data[3], 
            'gender': user_data[4],
            'city' : user_data[5],
            'country': user_data[6]
        }
       return jsonify(user), 200
    
    return jsonify({'success': False,'message': "Unknown internal error"}), 500 # Internal error

@app.route("/get_user_data_by_email/<email>", methods=['GET'])
def get_user_data_by_email(email):
    # 200v, 401v, 404v, 405v, 500v
    if request.method != 'GET':
        return jsonify({'success': False,'message': 'Bad Method'}), 405
        
    token = request.headers.get('Authorization')
    
    if token is None:
        return jsonify({'success': False, 'message': "Missing token"}), 400 
    
    if check(email) is False:
        return jsonify({'success': False, 'message': 'The email does not follow a valid format'}), 400

    #user_data = validateToken(token)
    user_data = checkTokenInDb(token)
    if user_data == False:
        return jsonify({'success': False, 'message': "Incorrect token"}), 401 # unauthorize

    else:
        message = getUserDataByEmailHelper(email)
        if message == "Email not found":
            return jsonify({'success': False, 'message': 'Email not found'}), 404 # Not Found
        else:
            return jsonify(message), 200
    
    return jsonify({'success': False,'message': "Unknown internal error"}), 500 # Internal error
    

@app.route("/get_user_messages_by_email/<email>", methods=['GET'])
def get_user_messages_by_email(email):
    # 200(v), 401(v), 404(v), 405(v), 500(v)
    # missing parameter 400
    # bad method 405, no need, catch by Flask
    # check email is false
    if request.method != 'GET':
        return jsonify({'success': False,'message': 'Bad Method'}), 405
        
    token = request.headers.get('Authorization')

    if token is None:
        return jsonify({'success': False, 'message': "Missing token"}), 400 

    # if token is None, return 405 #no email is 400
    if check(email) is False:
        return jsonify({'success': False, 'message': 'Empty email'}), 400 
    
    #user_data = validateToken(token)
    user_data = checkTokenInDb(token)
    if user_data == False:
        return jsonify({'success': False, 'message': "Incorrect token"}), 401 # Unauthorised

    message = getUserMessagesByEmail(email)
    
    if message == 'email not found':
        return  jsonify({'success': False, 'message': 'User not found'}), 404 # 
    else:
        return jsonify({'success': True, 'message': message}), 200 # OK
    
    return jsonify({'success': False,'message': "Unknown internal error"}), 500 # Internal error

@app.route("/change_password", methods=['PUT'])
def change_password():
    # 200v, 400v, 401v, 405v, 500v
    if request.method != 'PUT':
        return jsonify({'success': False,'message': 'Bad Method'}), 405

    token = request.headers.get('Authorization')
    data = request.get_json()
    oldPassword =  data['oldpassword']
    newPassword =  data['newpassword']
    
    if token is None:
        return jsonify({'success': False, 'message': "Missing token"}), 400 
    
    if oldPassword is None or newPassword is None:
        return jsonify({'success': False,'message': 'Please fill in the password field'}), 400

    #user_data = validateToken(token)
    user_data = checkTokenInDb(token)
    if user_data == False:
        return jsonify({'success': False, 'message': "Incorrect token"}), 401
    elif oldPassword != user_data[1]:
        return jsonify({'success': False,'message': 'Incorrect old password'}), 400
    else:
        changePasswordHelper(newPassword, oldPassword, user_data[0])
        return jsonify({'success': True, 'message': "Password updated successfully"}), 200

    return jsonify({'success': False,'message': "Unknown internal error"}), 500 # Internal error
    

@app.route("/get_user_messages_by_token", methods=['GET'])
def get_user_messages_by_token():
    #200v, 401v, 405v, 500v
    if request.method != 'GET':
        return jsonify({'success': False,'message': 'Bad Method'}), 405

    token = request.headers.get('Authorization') 
    if token is None:
        return jsonify({'success': False, 'message': "Missing token"}), 400 

    #user_data = validateToken(token)
    user_data = checkTokenInDb(token)

    if user_data == False:
        return jsonify({'success': False, 'message': "Incorrect token"}), 401 #unautorised
    else:
        return jsonify({'success': True, 'message': getUserMessagesByTokenHelper(user_data[0])}), 200

    return jsonify({'success': False,'message': "Unknown internal error"}), 500 # Internal error

@app.route("/sign_out", methods=['DELETE'])
def sign_out(): # Question 400 
    # 200v, 400, 401v, 405v, 500v
    if request.method != 'DELETE':
        return jsonify({'success': False,'message': 'Bad Method'}), 405
    
    token = request.headers.get('Authorization')
        
    if token is None:
        return jsonify({'success': False, 'message': "Missing token"}), 400
    
    #user_data = validateToken(token)
    user_data = checkTokenInDb(token)
    
    if user_data == False:
        return jsonify({'success': False, 'message': "Incorrect token"}), 401
    
    else:
        signOutHelper(user_data[0])
        active_sessions.pop(user_data[0])
        return jsonify({'success': True, 'message': "Successfully logged out"}), 200
    
    return jsonify({'success': False,'message': "Unknown internal error"}), 500 # Internal error

@app.route("/post_message", methods=['POST'])
def post_message():
    #201(v), 401(v), 400(v), 405(v), 500(v)
    if request.method != 'POST':
        return jsonify({'success': False,'message': 'Bad Method'}), 405

    token = request.headers.get('Authorization')
    data = request.get_json()
        
    if token is None:
        return jsonify({'success': False, 'message': "Missing token"}), 400 
    
    content =  data['message']
    post_to =  data['email']

    if content is None:
        return jsonify({'success': False, 'message': "Empty message"}), 400 # Bad request
    if post_to is None: 
        return jsonify({'success': False, 'message': "Empty email"}), 400 # Bad request
    
    #user_data = validateToken(token)
    user_data = checkTokenInDb(token)
   
    if user_data == False:
        return jsonify({'success': False, 'message': "Incorrect token"}), 401 # Unauthorized
        
    post_from = user_data[0] #author
    success = postMessageHelper(post_from, post_to, content)
    
    if success:
        return jsonify({'success': True, 'message': "Message successfully posted!"}), 201 # Created
    else:
        return jsonify({'success': False,'message': "User not found"}), 404 
    
    return jsonify({'success': False,'message': "Unknown internal error"}), 500 # Internal error


if __name__ == '__main__':
    app.run()
