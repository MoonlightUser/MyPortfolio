import { getUsers } from '../functions/database.js';
import { addUser } from '../functions/database.js';
import { createToken } from '../functions/token.js';
import { CLIENT_URL } from "../config.js";

document.getElementById('regin-form-submit').addEventListener('click', (e) => {
    //css
    document.body.style.cursor = "wait";
    document.body.appendChild(document.createElement('div')).className = "loader";
    document.getElementById('regin-form-submit').style.cursor = "wait";
    document.getElementById('regin-form-submit').disabled = true;
    //end css
    const username = document.getElementById('regin-form-username').value;
    const password = document.getElementById('regin-form-password').value;
    const repeatPassword = document.getElementById('regin-form-repeat-password').value;
    const email = document.getElementById('regin-form-email').value;
    addUser(username, password, repeatPassword, email, (response) => {
        switch (response) {
            case "1": // user added
                console.log("User added");

                createToken(username, password, (response) => {
                    response = JSON.parse(response);
                    window.localStorage.setItem("token", response);
                    window.localStorage.setItem("user", username);
                    window.location.href = CLIENT_URL + "/pages/main-autorised.html";
                });

                break;
            case "2": // user already exists by username
                console.log("user already exists");
                drawError('regin-form-username', 'username-error', 'User already exists by username');
                break;
            case "3": // passwords do not match with repeat-password
                console.log("Passwords do not match");
                drawError('regin-form-repeat-password', 'repeat-password-error', 'Passwords do not match');
                break;
            case "4": 
                console.log("Password is too short (min 6 symbols) or contains forbidden symbols");
                drawError('regin-form-password', 'password-error', 'Password is too short (min 6 symbols) or contains forbidden symbols');
                break;
            case "5":
                console.log("Username is too short (min 3 symbols) or too long (max 20 symbols) or contains forbidden symbols");
                drawError('regin-form-username', 'username-error', 'Username is too short (min 3 symbols) or too long (max 20 symbols) or contains forbidden symbols');
                break;
            case "6": // email is not valid
                console.log("Email is not valid");
                drawError('regin-form-email', 'email-error', 'Email is not valid');
                break;
            case "7": // email already exists
                console.log("email already exists");
                drawError('regin-form-email', 'email-error', 'Email already exists');
                break;
            default:
                console.log("unknown error");
                break;
        }
        //css
        document.body.style.cursor = "default";
        document.getElementById('regin-form-submit').style.cursor = "pointer";
        document.getElementById('regin-form-submit').disabled = false;
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