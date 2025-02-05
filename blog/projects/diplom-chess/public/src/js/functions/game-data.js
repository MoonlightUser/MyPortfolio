import { SERVER_URL } from "../config.js";

export function createGameData (roomName, data, callback) {
    data = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/create-game-data",
        data: { roomName, data},
        success: function (response) {
            callback(response);
        }
    });
}

export function createDataConfig () {
    const data = {
        chess: {
            map: new Chess().fen(),
            turn: "w",
        },
        chat: {
            messages: [
                {'name': 'System', 'message': 'Welcome to the chat!'}
            ]
        },
    }
    console.log(data);
    return data;
}

export function getGameData (roomName, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/get-game-data",
        data: { roomName},
        success: function (response) {
            callback(response);
        }
    });
}

export function updateGameData (roomName, data, callback) {
    data = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/update-game-data",
        data: { roomName, data},
        success: function (response) {
            callback(response);
        }
    });
}

export function deleteGameData (roomName, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/delete-game-data",
        data: { roomName},
        success: function (response) {
            callback(response);
        }
    });
}