import { SERVER_URL } from "../config.js";
import { loadMassageHTML } from "./chat.js";

export function checkRoom (roomName, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/check-room",
        data: { roomName},
        success: function (response) {
            callback(response);
            },
    });
}

export function checkJoinRoom (roomName, roomPassword, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/check-join-room",
        data: { roomName, roomPassword},
        success: function (response) {
            callback(response);
            },
    });
}

export function joinRoom (roomName, userName, callback ) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/join-room",
        data: { roomName, userName},
        success: function (response) {
            callback(response);
            },
    });
}


export function createRoom (roomName, roomPassword, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/create-room",
        data: { roomName, roomPassword},
        success: function (response) {
            callback(response);
        }
    });
}

export function changeRoom (roomName, userName, status, password, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/change-room",
        data: { roomName, userName, status, password},
        success: function (response) {
            callback(response);
        }
    });
}

export function getRoom (roomName, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/get-room",
        data: { roomName},
        success: function (response) {
            callback(response);
        }
    });
}

export function getRooms (callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/get-rooms",
        success: function (response) {
            callback(response);
        }
    });
}

export function deleteRoom (roomName, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/delete-room",
        data: { roomName},
        success: function (response) {
            callback(response);
        }
    });
}

export function connectToPusher (roomName, userName, callback) {
    const pusher = new Pusher('37167ed4b28138b6fe32', {
        cluster: 'eu'
    });
    const channel =  pusher.subscribe("publick-" + roomName);
    channel.bind('check', function(data) {
        alert('Received event with data:', data);
    });
    pusher.connection.bind('connected', function() {
        console.log("connected");
        channel.bind('pusher:subscription_succeeded', function(members) {
            console.log("subscription_succeeded" );
            callback();
        });
    });
    pusher.connection.bind('disconnected', function() {
        console.log("disconnected");
    });

    // events 
    channel.bind('message', function(data) {
        loadMassageHTML(JSON.parse(data.message), userName);
    });
    return channel;
}



export function createEvents (roomName, callback) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/create-events",
        data: { roomName},
        success: function (response) {
            callback(response);
        }
    });
}


export function sendMessageToPusher (roomName, message) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/send-message-to-pusher",
        data: { roomName, message}
    });
}

export function triggerEventPusher (roomName, event, data) {
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/trigger-event-pusher",
        data: { roomName, event, data}
    });
}
