import { SERVER_URL } from "../config.js";

export function getUsers(callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/get-users",
        success: function (response) {
            callback(response);
            },
    });
}

export function addUser(username, password, repeatPassword, email, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/add-user",
        data: { username, password,repeatPassword, email},
        success: function (response) {
            callback(response);
            },
    });
}

export function findUser(username, password, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/find-user",
        data: { username, password},
        success: function (response) {
            callback(response);
            },
    });
}