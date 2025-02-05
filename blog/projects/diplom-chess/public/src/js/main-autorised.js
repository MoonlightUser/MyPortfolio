import { readToken } from "./functions/token.js";
import { CLIENT_URL } from "./config.js";
import {checkRoom, createRoom, joinRoom, checkJoinRoom, getRooms} from "./functions/pusher.js";

const User = {
    username: "",
}



if (window.localStorage.getItem("token") == null) { // if token is not exist
    window.location.href = CLIENT_URL + "/main.html";
}
else { // if token is exist
    readToken(window.localStorage.getItem("token"), (response) => {
        if (JSON.parse(response) === false) { // if token is expired
            window.location.href = CLIENT_URL + "/main.html";
        }
        else { // if token is valid
            window.localStorage.setItem("token", JSON.parse(response));
            User.username = window.localStorage.getItem("user");
        }
    });
}
if (localStorage.getItem("room") !== null) {
    const rejoin = document.createElement('button')
    rejoin.id = "rejoin"
    rejoin.innerHTML = "You left the game!"
    rejoin.addEventListener("click", ()=>{
        window.location.href = CLIENT_URL + "/pages/game.html";
    })
    document.getElementById('nav').appendChild(rejoin);
}

getRooms((res) => {
    let rooms = res;
    rooms = rooms.split("\n");
    rooms.pop();
    if (rooms.length == 0) {
        const roomHTML = document.createElement('div')
        roomHTML.className = "room"
        const roomName = document.createElement('div')
        roomName.className = "room-name"
        roomName.innerHTML = " There is no rooms ;( "
        roomHTML.appendChild(roomName);
        document.getElementById('rooms-wrapper').appendChild(roomHTML);
        return;
    }
    rooms.forEach(room => {
        const roomHTML = createRoomElement(room);
        document.getElementById('rooms-wrapper').appendChild(roomHTML);
    });
})

function createRoomElement(room){
    const roomHTML = document.createElement('div')
    roomHTML.className = "room"
    const roomName = document.createElement('div')
    roomName.className = "room-name"
    roomName.innerHTML = "User is: " + room
    const roomPlayers = document.createElement('div')
    roomPlayers.className = "room-players"
    roomPlayers.innerHTML = "Players: 1/2"
    const btnJoin = document.createElement('button')
    btnJoin.className = "room-join"
    btnJoin.innerHTML = "Join"
    btnJoin.id = room
    btnJoin.addEventListener("click", ()=>{
        console.log(room);
        checkJoinRoom(room, '', (res) => {
            switch (res) {
                case "1":
                    // room is exist. join room
                    swal({
                        title: "Are you sure?",
                        text: "Do you want to join this game?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    .then((res) => {
                        if (res) {
                            // join room
                            joinRoom(room, User.username, (res) => {
                                if (res === "2") {
                                    swal("Ooops!", "Something went wrong!", "error");
                                    return;
                                }
                                else if (res === "3") {
                                    swal("Ooops!", "Its your room already!", "error");
                                }
                                else{
                                    localStorage.setItem("room", room);
                                    window.location.href = CLIENT_URL + "/pages/game.html";
                                }
                            });
                        }
                    });
                    break;
                case "2":
                    // room is not exist.
                    swal({
                        title: "There is no such a room",
                        icon: "error",
                        buttons: true,
                        dangerMode: true,
                    })
                    break;
                case "3":
                    // password is not correct.
                    swal({
                        title: "Password is not correct",
                        icon: "error",
                        buttons: true,
                        dangerMode: true,
                    })
                    break;
                case "4":
                    // room is full is not correct.
                    swal({
                        title: "Room is full",
                        icon: "error",
                        buttons: true,
                        dangerMode: true,
                    })
                    break;
                default:
                    swal("Oops", "We have issues now. Pleas try to reload the web page", "error");
                    break;
            }
        }); // check if room is exist
    })
    roomHTML.appendChild(roomName)
    roomHTML.appendChild(roomPlayers)
    roomHTML.appendChild(btnJoin)
    return roomHTML
}

document.getElementById('logout').addEventListener("click", ()=>{
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.location.href = CLIENT_URL + "/main.html";
})

document.getElementById('create-game').addEventListener("click", ()=>{
    const password = document.getElementById('game-password').value;
    if (User.username === "") {
        swal("Session expired", "You must login!", "error");
    }
    checkRoom(User.username, (res) => {
        switch (res) {
            case "1":
                // room is not exist. create room
                swal({
                    title: "Are you sure?",
                    text: "Do you want to create a game?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((res) => {
                    if (res) {
                        // create room
                        createRoom(User.username, password, (res) => {
                            localStorage.setItem("room", User.username);
                            window.location.href = CLIENT_URL + "/pages/game.html";
                        });
                    }
                });
                break;
            case "2":
                swal("Error", "You are already in game!", "error");
                break;
            default:
                swal("Oops", "We have issues now. Pleas try to reload the web page", "error");
                break;
        }
    }); // check if room is exist
})

document.getElementById('join-game').addEventListener("click", ()=>{
    const roomPassword = document.getElementById('join-game-password').value;
    const roomName = document.getElementById('join-game-name').value;
    if (User.username === "") {
        swal("Session expired", "You must login!", "error");
    }
    checkJoinRoom(roomName, roomPassword, (res) => {
        switch (res) {
            case "1":
                // room is exist. join room
                swal({
                    title: "Are you sure?",
                    text: "Do you want to join this game?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((res) => {
                    if (res) {
                        // join room
                        joinRoom(roomName, User.username, (res) => {
                            if (res === "2") {
                                swal("Ooops!", "Something went wrong!", "error");
                                return;
                            }
                            else if (res === "3") {
                                swal("Ooops!", "Its your room already!", "error");
                            }
                            else{
                                localStorage.setItem("room", roomName);
                                window.location.href = CLIENT_URL + "/pages/game.html";
                            }
                        });
                    }
                });
                break;
            case "2":
                // room is not exist.
                swal({
                    title: "There is no such a room",
                    icon: "error",
                    buttons: true,
                    dangerMode: true,
                })
                break;
            case "3":
                // password is not correct.
                swal({
                    title: "Password is not correct",
                    icon: "error",
                    buttons: true,
                    dangerMode: true,
                })
                break;
            case "4":
                // room is full is not correct.
                swal({
                    title: "Room is full",
                    icon: "error",
                    buttons: true,
                    dangerMode: true,
                })
                break;
            default:
                swal("Oops", "We have issues now. Pleas try to reload the web page", "error");
                break;
        }
    }); // check if room is exist
})

