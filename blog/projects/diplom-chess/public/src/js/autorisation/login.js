import { createToken } from '../functions/token.js';
import { findUser } from '../functions/database.js';
import { CLIENT_URL } from "../config.js";


document.getElementById('login-form-submit').addEventListener('click', (e) => {

    //css
    document.body.style.cursor = "wait";
    document.getElementById('login-form-submit').style.cursor = "wait";
    document.body.appendChild(document.createElement('div')).className = "loader";
    document.getElementById('login-form-submit').disabled = true;
    //end css

    const username = document.getElementById('login-form-username').value;
    const password = document.getElementById('login-form-password').value;
    findUser(username, password, (response) => {
        switch (response) {
            case "1": // user found
                console.log("User found");
                createToken(username, password, (response) => {
                    response = JSON.parse(response);
                    window.localStorage.setItem("token", response);
                    window.localStorage.setItem("user", username);
                    window.location.href = CLIENT_URL + "/pages/main-autorised.html";
                });
                break;
            case "2": // password is incorrect
                console.log("Password is incorrect");
                drawError('login-form-password', 'password-error', 'Wrong password');
                break;
            case "3": // user not found
                console.log("User not found");
                drawError('login-form-username', 'username-error', 'User not found');
                break;
            default:
                console.log("unknown error");
                break;
        }
        //css
        document.body.style.cursor = "default";
        document.getElementById('login-form-submit').style.cursor = "pointer";
        document.getElementById('login-form-submit').disabled = false;
        document.getElementsByClassName('loader')[0].remove();
        //end css
    });
});

function drawError(inputId, errorId, text) {
    document.getElementById(errorId).innerHTML = text;
    document.getElementById(inputId).style.border = "2px solid red";
    document.getElementById(inputId).addEventListener('focus', () => {
        document.getElementById(errorId).innerHTML = "";
        document.getElementById(inputId).style.border = "2px solid #b37aff";
    });
    document.getElementById(inputId).addEventListener('focusout', () => {
        document.getElementById(inputId).style.border = "";
    });
}

