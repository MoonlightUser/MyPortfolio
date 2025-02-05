import { readToken } from './functions/token.js';
import { CLIENT_URL } from './config.js';

if (window.localStorage.getItem("token") != null) {
    readToken(window.localStorage.getItem("token"), (response) => {
        if (JSON.parse(response) === false) {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("user");
            swal("Session expired", "You must login!", "error");
        }
        else {
            window.localStorage.setItem("token", JSON.parse(response));
            console.log(CLIENT_URL + "/pages/main-autorised.html");
            window.location.href = CLIENT_URL + "/pages/main-autorised.html";
        }
    });
}