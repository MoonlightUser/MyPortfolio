import { SERVER_URL } from "../config.js";

export function createToken(username, password, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/create-token",
        data: { username, password},
        success: function (response) {
            console.log("createToken response", response);
            callback(response);
            },
    });
}

export function readToken(token, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/read-token",
        data: { token},
        success: function (response) {
            callback(response);
            },
    });
}


