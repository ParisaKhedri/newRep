displayView = function (viewid) {

    var viewContent = document.getElementById(viewid).innerHTML;
    document.body.innerHTML = viewContent;
    if (viewid == "profileview") {
        updateUserWall(true);
        getUserInfo(true);
    }

};

function establish_socket_connection(token) {
    var socket = new WebSocket('ws://localhost:8000/login');

    socket.onopen = function () {
        socket.send(token);
    };

    socket.onerror = function (error) {
        console.error("WebSocket error:", error);
    };

    socket.onclose = function (event) {
        if (token) {
            localStorage.removeItem("token")
            displayView('welcomeview');
        }
    };
}

window.onload = function () {
    var token =localStorage.getItem("token")
    if (token) {
        // Token exists, user is signed in, display Profile view
        displayView('profileview');
    } else {
        // No token, user is not signed in, display Welcome view
        displayView('welcomeview');
    }

};


function signInRequest(username, password, errorPlaceholder) {

    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/sign_in', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data.success) {
                    var token = data.data;
                    localStorage.setItem('token', token);
                    if (token) {
                        establish_socket_connection(token);
                        displayView('profileview');
                    }
                } else {
                    errorPlaceholder.textContent = data.message;
                    errorPlaceholder.style.color = "red";
                }
            }else if(xhr.status === 400){ 
                errorPlaceholder.textContent = "Oops! Wrong password";
                errorPlaceholder.style.color = "red";  
            }else if(xhr.status === 401){
                errorPlaceholder.textContent = "Oops! No such user";
                errorPlaceholder.style.color = "red";  
            }else if(xhr.status === 405){
                errorPlaceholder.textContent = "Oops! Wrong method";
                errorPlaceholder.style.color = "red";  
            }else if(xhr.status === 500){ 
                errorPlaceholder.textContent = "Oops! Unknown internal error";
                errorPlaceholder.style.color = "red";  
            } else {
                errorPlaceholder.textContent = 'Oops! Network response was not ok';
                errorPlaceholder.style.color = "red";
            }
        }
    };

    xhr.onerror = function () {
        errorPlaceholder.textContent = 'Connection failed.';
        errorPlaceholder.style.color = "red";
    };

    xhr.send(JSON.stringify({ username: username, password: password }));
}

// Sign in function
function validateSigninForm() {

    var username = document.loginForm.email.value;
    var password = document.loginForm.password.value;
    var signinError = document.getElementById("signinPerror");

    signInRequest(username, password, signinError)
    return false
}

function validateSignupForm() {
    var email = document.signupForm.email.value;
    var password = document.signupForm.password.value;
    var repeatPassword = document.signupForm.repeatpassword.value;
    var firstname = document.signupForm.firstname.value;
    var familyname = document.signupForm.familyname.value;
    var gender = document.signupForm.gender.value;
    var city = document.signupForm.city.value;
    var country = document.signupForm.country.value;
    var signupError = document.getElementById("signupPerror");

    if (password != repeatPassword) {
        signupError.textContent = "Password does not match!";
        signupError.style.color = "red";
        return false;
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/sign_up', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 201) {
                    var data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        signInRequest(email, password, signupError);
                    } else {
                        signupError.textContent = data.message;
                        signupError.style.color = "red";
                    }
                } else {
                    if (xhr.status === 409){
                        signupError.textContent = 'Oops! This email is already taken';
                        signupError.style.color = "red";
                    }

                    else if (xhr.status === 400){ 
                        signupError.textContent = 'Oops! Something is missing' + xhr.responseText;
                        signupError.style.color = "red";
                    }

                    else if (xhr.status === 405){ 
                        signupError.textContent = 'Oops! Bad method';
                        signupError.style.color = "red";
                    }

                    else if (xhr.status === 500){ 
                        signupError.textContent = 'Oops! Something went wrong :Q';
                        signupError.style.color = "red";
                    }
                }
            }
        };
        xhr.send(JSON.stringify({
            email: email,
            password: password,
            repeatPassword: repeatPassword,
            firstname: firstname,
            familyname: familyname,
            gender: gender,
            city: city,
            country: country
        }));
        return false;
    }
}


function showPanel(panelId) {
    // Hide all panels
    var allPanels = document.querySelectorAll('.tabPanel');

    allPanels.forEach(panel => {
        panel.style.display = 'none';
    });

    // Deselect all tabs
    var allTabs = document.querySelectorAll('.tab');

    allTabs.forEach(tab => {
        tab.style.backgroundColor = 'transparent';
    });

    // Show the selected panel and mark the selectet tab
    var selectedPanel = document.getElementById(panelId);
    if (selectedPanel) {
        selectedPanel.style.display = 'block';
        if (selectedPanel.id == "homePanel") {
            document.getElementById("homeTab").style.backgroundColor = "blue";
        } else if (selectedPanel.id == "browsePanel") {
            document.getElementById("browseTab").style.backgroundColor = "blue";

        } else {
            document.getElementById("accountTab").style.backgroundColor = "blue";

        }
    }
}

function getUserInfoRequest(token) {
    return new Promise(function (resolve, reject) {
        // Create a new XMLHttpRequest object
        var xhr = new XMLHttpRequest();

        // Configure it to make a GET request to the server
        xhr.open('GET', '/get_user_data_by_token', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', token);

        // Set up a callback function to handle the response
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data.success) {
                    resolve(data);
                } else {
                    reject(new Error(data.message || 'Request failed'));
                }
            }else if(xhr.status === 400){
                reject(new Error("Oops! There is missing field "));} //400 missing parameter (like email)
            else if(xhr.status === 405){
                reject(new Error("Oops! Wrong method"));
            }else if(xhr.status === 401){
                reject(new Error("Oops! Incorrect token"));  
            }else if(xhr.status === 500){
                reject(new Error("Oops! Unknown internal error"));  
            } else {
                reject(new Error('Oops! Network response was not ok'));
            }
        };

        // Set up a callback function to handle errors
        xhr.onerror = function () {
            reject(new Error('Request failed'));
        };

        // Send the GET request
        xhr.send();
    });
}

function getUserInfo(Myposts) {
    var token = localStorage.getItem("token");

    // From Home Tab
    if (Myposts) {
        var userInfoContainerElem = document.getElementById("homePanelUserInfoContainer");
        userInfoContainerElem.innerHTML = "";

        getUserInfoRequest(token)
            .then(data => {
                if (data.success) {
                    appendUserInfo(data, userInfoContainerElem);
                }
            })
            .catch(error => {
                // Handle errors here
                console.error('Error in getUserInfoRequest (Home Tab)', error);
            });
    }

    // From Browse Tab
    else {
        var searchByEmail = document.getElementById("browseUserWallByEmail").value;
        var userInfoContainerElem = document.getElementById("browsePanelUserInfoContainer");
        var searchUserWallPerror = document.getElementById("searchUserWallPerror");
        userInfoContainerElem.innerHTML = "";

        if (searchByEmail.length == 0) {
            searchUserWallPerror.textContent = "Empty email is not allowed";
            searchUserWallPerror.style.color = "red";
        } else {
            // Create a new XMLHttpRequest object
            var xhr = new XMLHttpRequest();

            // Configure it to make a GET request to the server
            xhr.open('GET', `/get_user_data_by_email/${encodeURIComponent(searchByEmail)}`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', token);

            // Set up a callback function to handle the response
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);

                    if (data.success) {
                        appendUserInfo(data, userInfoContainerElem);
                        updateUserWall(false);
                        var browsePanelSearchUser = document.getElementById("browsePanelSearchUser");
                        browsePanelSearchUser.style.display = "none";

                        var browsePanelSearchUserWallResult = document.getElementById("browsePanelSearchUserWallResult");
                        browsePanelSearchUserWallResult.style.display = "block";

                        searchUserWallPerror.textContent = data.message;
                        searchUserWallPerror.style.color = "green";
                    } else {
                        searchUserWallPerror.textContent = data.message;
                        searchUserWallPerror.style.color = "red";
                    }
                } else {
                    searchUserWallPerror.style.color = "red";
                    
                    if (xhr.status === 405){ 
                        searchUserWallPerror.textContent = 'Oops! Bad Method';
                    }

                    else if (xhr.status === 400){ 
                        searchUserWallPerror.textContent = 'Oops! Email has wrong format';
                    }

                    else if (xhr.status === 401){ 
                        searchUserWallPerror.textContent = 'Oops! Incorrect token';
                    }

                    else if (xhr.status === 404){
                        searchUserWallPerror.textContent = 'Oops! Email not found';
                    }

                    else if (xhr.status === 500){ 
                        searchUserWallPerror.textContent = 'Oops! Something went wrong!';
                    }
                    
                    // Handle errors here
                    console.error('Network response was not ok');
                }
            };

            // Set up a callback function to handle errors
            xhr.onerror = function () {
                // Handle errors here
                console.error('Request failed');
            };

            // Send the GET request
            xhr.send();

        }
    }
}

function appendUserInfo(user, userInfoContainerElem) {
    email = user.email;
    appendChild(email, userInfoContainerElem);
    firstname = user.firstname;
    appendChild(firstname, userInfoContainerElem);
    familyname = user.familyname;
    appendChild(familyname, userInfoContainerElem);
    gender = user.gender;
    appendChild(gender, userInfoContainerElem);
    city = user.city;
    appendChild(city, userInfoContainerElem);
    country = user.country;
    appendChild(country, userInfoContainerElem);
}

function appendChild(variElem, parentElem){
    var node = document.createElement("li");
    node.style.wordWrap = "break-word";
    var textnode = document.createTextNode(variElem);
    node.appendChild(textnode);
    parentElem.appendChild(node);
}

function appendChildPost(variElem, parentElem) {
    var node = document.createElement("li");
    node.style.wordWrap = "break-word";
    node.draggable = true;
    node.addEventListener('dragstart', dragStart);
    var textnode = document.createTextNode(variElem);
    node.appendChild(textnode);
    parentElem.appendChild(node);
}

function dragStart(event) {
    console.log("drag")
    event.dataTransfer.setData("text/plain", event.target.innerText);
}

function drop(event) {
    console.log("drop")
    event.preventDefault();
    var data = event.dataTransfer.getData("text/plain");
    event.target.value += data;
}

function updateUserWall(Myposts) {
    var token = localStorage.getItem("token");
    let toEmail = "";
    if (Myposts) {
        var updateButton = document.getElementById("homePanelPostViewUpdateButton");
        var postButton = document.getElementById("homePanelPostViewPostButton");
        var postsList = document.getElementById("homePanelUserWallPosts");
        var content = document.getElementById("homePanelPostMessageContent");
        content.addEventListener("drop", drop);
        var postPerror = document.getElementById("homePanelPostperror");

        getUserInfoRequest(token)
            .then(data => {
                if (data.success) {

                    toEmail = data.email;
                    content.value = '';

                    updatePosts(Myposts, token, postsList, toEmail);
                    updateButton.onclick = function () {
                        updatePosts(Myposts, token, postsList, toEmail);
                    };

                    postButton.onclick = function () {
                        postMessage(Myposts, token, postsList, content, toEmail, postPerror);
                        updatePosts(Myposts, token, postsList, toEmail);
                    }
                }
            })

    } else {
        var searchByEmail = document.getElementById("browseUserWallByEmail").value;
        var updateButton = document.getElementById("browsePanelPostViewUpdateButton");
        var postButton = document.getElementById("browsePanelPostViewPostButton");
        var postsList = document.getElementById("browsePanelUserWallPosts");
        var content = document.getElementById("browsePanelPostMessageContent");
        content.addEventListener("drop", drop);
        toEmail = searchByEmail;
        var postPerror = document.getElementById("browsePanelPostperror");
        content.value = '';

        var xhr = new XMLHttpRequest();
        xhr.open('GET', `/get_user_data_by_email/${encodeURIComponent(toEmail)}`, true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', token);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        updatePosts(false, token, postsList, toEmail);

                        updateButton.onclick = function () {
                            updatePosts(false, token, postsList, toEmail);
                        };

                        postButton.onclick = function () {
                            postMessage(false, token, postsList, content, toEmail, postPerror);
                            updatePosts(false, token, postsList, toEmail);
                        };
                    }

                }
            }
        };
        xhr.send();
    }
}



function updatePosts(Myposts, token, postsList, reciverEmail) {
    if (Myposts) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', '/get_user_messages_by_token', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', token);

        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);

                if (data.success) {
                    postsList.innerHTML = "";

                    if (data.message.length === 0) {
                        appendChildPost("No post to be displayed at the moment, try making a new post", postsList);
                    } else {

                        for (var i in data.message) {
                            var stringPost = "Author: " + data.message[i].Author + '\n' + '  Message: ' + data.message[i].Content;
                            appendChildPost(stringPost, postsList);
                        }

                    }

                }
            } else {
                console.error('Network response was not ok');
            }
        };

        xhr.send();
    } else {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', `/get_user_messages_by_email/${encodeURIComponent(reciverEmail)}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', token);

        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);

                if (data.success) {
                    postsList.innerHTML = "";

                    if (data.message.length === 0) {
                        appendChildPost("No post to be displayed at the moment, try making a new post", postsList);
                    } else {

                        for (var i in data.message) {
                            var stringPost = "Author: " + data.message[i].Author + '\n' + '  Message: ' + data.message[i].Content;
                            appendChildPost(stringPost, postsList);
                        }

                    }
                }
                 
            } else {
                console.error('Network response was not ok');
            }
        };

        xhr.send();
    }
}

function postMessage(Myposts, token, postPanel, content, toEmail, postPerror) {

    if (content.value.length == 0) {
        postPerror.textContent = "Empty post is not allowed";
        postPerror.style.color = "red";
    } else {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 201) {
                    var data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        postPerror.textContent = data.message;
                        postPerror.style.color = "green";
                        content.value = '';
                        if (Myposts) {
                            updatePosts(Myposts, token, postPanel, toEmail);
                        } else {
                            updatePosts(false, token, postPanel, toEmail);
                        }
                    } else {
                        postPerror.textContent = data.message;
                        postPerror.style.color = "red";
                    }
                } 
                else if (xhr.status === 400){
                    postPerror.textContent = 'Oops! All fields must be filled';
                    postPerror.style.color = "red";
                }
                else if (xhr.status === 401){
                    postPerror.textContent = 'Oops! Incorrect token!';
                    postPerror.style.color = "red";
                }
                else if (xhr.status === 405){
                    postPerror.textContent = 'Oops! Bad method';
                    postPerror.style.color = "red";
                }
                else if (xhr.status === 500){
                    postPerror.textContent = 'Oops! Something went wrong!';
                    postPerror.style.color = "red";
                }
                else {
                    postPerror.textContent = 'Network response was not ok';
                    postPerror.style.color = "red";
                }
            }
        };

        xhr.open("POST", "/post_message", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", token);

        var messageData = {
            message: content.value,
            email: toEmail
        };

        console.log("tried to post a message")

        xhr.send(JSON.stringify(messageData));

    }
    return false;
}


function backToBrowsePanelSearchview() {
    var browsePanelSearchUser = document.getElementById("browsePanelSearchUser");
    browsePanelSearchUser.style.display = "block";

    var browsePanelSearchUserWallResult = document.getElementById("browsePanelSearchUserWallResult");
    browsePanelSearchUserWallResult.style.display = "none";
}

//accountPanel_________________________________

function changePassword() {
    var token = localStorage.getItem("token");
    var oldPassword = document.accountForm.accountOldPassword.value;
    var newPassword = document.accountForm.accountNewPassword.value;
    var repeatNewPassword = document.accountForm.accountRepeatNewPassword.value;
    var accountPerror = document.getElementById("accountPerror");

    if (newPassword != repeatNewPassword) {
        accountPerror.textContent = "Oops! Password does not match!";
        accountPerror.style.color = "red";
        return false;

    } else {
        // Create a new XMLHttpRequest object
        var xhr = new XMLHttpRequest();

        // Configure it to make a PUT request to the server
        xhr.open('PUT', '/change_password', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', token);

        // Set up a callback function to handle the response
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);

                if (data.success) {
                    accountPerror.textContent = "Password successfully changed!";
                    accountPerror.style.color = "green";
                } else {
                    accountPerror.textContent = data.message;
                    accountPerror.style.color = "red";
                }
            }else if(xhr.status === 400){ 
                accountPerror.textContent = "Oops! Incorrect old password";
                accountPerror.style.color = "red";  
            }else if(xhr.status === 401){
                accountPerror.textContent = "Oops! Incorrect token";
                accountPerror.style.color = "red";  
            }else if(xhr.status === 405){
                accountPerror.textContent = 'Oops! Bad Method';
                accountPerror.style.color = "red"; 
            }else if(xhr.status === 500){ 
                accountPerror.textContent =  "Oops! Unknown internal error";
                accountPerror.style.color = "red";
            }else {
                accountPerror.textContent = "Oops! Error occurred during password change";
                accountPerror.style.color = "red";
            }
        };
        xhr.onerror = function () {
            accountPerror.textContent = "Request failed";
            accountPerror.style.color = "red";
        };
        var requestBody = JSON.stringify({
            oldpassword: oldPassword,
            newpassword: newPassword,
        });

        xhr.send(requestBody);

        return false;
    }
}

function signOut() {
    var token = localStorage.getItem("token");
    var signoutPerror = document.getElementById("signoutPerror");

    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Configure it to make a DELETE request to the server
    xhr.open('DELETE', '/sign_out', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', token);

    // Set up a callback function to handle the response
    xhr.onload = function () {
        
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (data.success) {
                localStorage.removeItem('token');
                displayView('welcomeview');

            } else {
                signoutPerror.textContent = data.message;
                signoutPerror.style.color = "red";
            }
        } else if (xhr.status === 405){
            signoutPerror.textContent = "Oops! Bad Method";
            signoutPerror.style.color = "red";
        }
        else if (xhr.status === 401){
            signoutPerror.textContent = 'Oops! Incorrect token';
            signoutPerror.style.color = "red";
        }
        else if (xhr.status === 400){
            signoutPerror.textContent = 'Oops! Missing token';
            signoutPerror.style.color = "red";
        }
        else if (xhr.status === 500){
            signoutPerror.textContent = 'Oops! Something went wrong';
            signoutPerror.style.color = "red";
        }else {
            var signoutPerror = document.getElementById("signoutPerror");
            signoutPerror.textContent = "Error occurred during sign out";
            signoutPerror.style.color = "red";
        }
    };

    // Set up a callback function to handle errors
    xhr.onerror = function () {
        var signoutPerror = document.getElementById("signoutPerror");
        signoutPerror.textContent = "Request failed";
        signoutPerror.style.color = "red";
    };

    // Send the DELETE request
    xhr.send();
}


