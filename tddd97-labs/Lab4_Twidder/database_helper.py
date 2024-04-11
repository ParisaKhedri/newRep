from flask import jsonify
from flask import g
from flask_jwt_extended import (create_access_token, get_jwt_identity)
import sqlite3

def get_db_connection(): 
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def close_db(e=None):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def validateToken(token, cursor):
    if token is None:
        return False
    
    cursor.execute('SELECT * FROM user WHERE token=?', (token,))
    user_data = cursor.fetchone()
    
    if user_data is None:
         return False
    else: 
        return user_data


def checkTokenInDb(token):
     # return False or user data
    conn = get_db_connection()
    cursor = conn.cursor()
   
    cursor.execute('SELECT * FROM user WHERE token=?', (token,))
    user_data = cursor.fetchone()
    
    if user_data is None:
         return False
    else: 
        return user_data

def signInHelper(email, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM user WHERE email=?', (email,))
    user_data = cursor.fetchone()

    if user_data is None:
        return "No such user"
    
    else:
        if user_data[1] == password:
            """token = user_data[7]
            if not token: 
                token = password #create_access_token(identity=user_data[0])
                addTokenToDb(user_data, token, email)
            return token"""
            token = create_access_token(identity=user_data[0])
            addTokenToDb(user_data, token, email)
            return token
        else:
            return "Wrong password"
            #return jsonify({'success': False, 'message': 'Wrong password'}), 200 

def addTokenToDb(user_data, access_token, email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE user SET token = ? WHERE email = ?", (access_token, email)) 
    conn.commit()
    conn.close()

def signUpHelper(email, password, firstname, familyname, gender, city, country):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Check if a user exist first
    cursor.execute('SELECT * FROM user WHERE email=?', (email,))
    user = cursor.fetchone()

    if user is not None:
        return False
    else:
        cursor.execute("INSERT INTO user (email, password, firstname, familyname, gender, city, country) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (email, password, firstname, familyname, gender, city, country)
            )
        conn.commit()
        conn.close()
        return True

def getUserDataByEmailHelper(email):
    #if email is None:
    #     return jsonify({'success': False, 'message': 'Fill in the email'}), 200
    
    conn = get_db_connection()
    cursor = conn.cursor()
    #user_data = validateToken(token, cursor)
    #if user_data == False:
    #    return jsonify({'success': False, 'message': "Incorrect token"}), 200
    cursor.execute('SELECT * FROM user WHERE email=?', (email,))
    data = cursor.fetchone()

    if data is None:
        return "Email not found"
    #return jsonify({'success': False, 'message': 'Email not found'}), 200

    else:
        user = {
            'success': True,
            'email': data[0],
            'firstname': data[2], 
            'familyname': data[3], 
            'gender': data[4],
            'city' : data[5],
            'country': data[6]
        }
        return user
    #return jsonify(user), 200,

def getUserMessagesByEmail(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Check if a user exist in db
    cursor.execute('SELECT * FROM user WHERE email=?', (email,))
    receipent_data = cursor.fetchone()

    if receipent_data is None:
        return 'email not found'
    else:
        cursor.execute('SELECT * FROM post WHERE post_to=?', (email,))
        messages = cursor.fetchall()
        messagelist = []
        if messages:
            for x in messages:
                messageElement = {
                    'Author': x[0], 
                    'Content': x[2] 
                }
                messagelist.append(messageElement)
        return messagelist


def changePasswordHelper(newPassword, oldPassword, email):    
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE user SET password = ? WHERE password = ? AND email = ?", (newPassword, oldPassword, email))

    conn.commit()
    conn.close()

def postMessageHelper(post_from, post_to, content):
  
    conn = get_db_connection()
    cursor = conn.cursor()
    # check if a receipent exist in db
    cursor.execute('SELECT * FROM user WHERE email=?', (post_to,))
    receipent_data = cursor.fetchone()
    
    if receipent_data is None:
        return False

    else: 
        cursor.execute("INSERT INTO post (post_from, post_to, content) VALUES (?, ?, ?)", (post_from, post_to, content))
        conn.commit()
        conn.close()

        return True

def getUserMessagesByTokenHelper(email):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM post WHERE post_to=?', (email,))
    messages = cursor.fetchall()
    messagelist = []
    if messages:
        for x in messages:
            messageElement = {
                'Author': x[0], 
                'Content': x[2] 
            }
            messagelist.append(messageElement)
    return messagelist


def signOutHelper(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE user SET token = NULL WHERE email = ?", (email,))
    conn.commit()
    conn.close()
