import { readToken } from "./functions/token.js";
import { CLIENT_URL } from "./config.js";
import { getRoom, connectToPusher, createEvents, sendMessageToPusher, triggerEventPusher, changeRoom, deleteRoom } from "./functions/pusher.js";
import { createGameData, getGameData, updateGameData, createDataConfig, deleteGameData } from "./functions/game-data.js";
import { loadMassagesHTML, loadMassageHTML } from "./functions/chat.js";
import { createGameHTML } from "./functions/chess.js";
import { movePiece, movePieceLocaly } from "./functions/chess.js";

const User = {
    username: "",
    roomName: "",
    type: "", // creator or joiner
    side: "", // white or black
}
let map = [];
let drawCount = 0;
let drawAsk = false;
let pusherChannel = "";
let gameStarted = '';
User.roomName = window.localStorage.getItem("room");
User.username = window.localStorage.getItem("user");

document.getElementById('home').addEventListener("click", () => {
    window.location.href = CLIENT_URL + "/pages/main-autorised.html";
})

if(User.roomName == null) {
    window.location.href = CLIENT_URL + "/pages/main-autorised.html";
}

//creator white, joiner black
getRoom(User.roomName, (res) => {
    const room = JSON.parse(res)[0];
    console.log(room);
    User.type = User.username === room["room-name"] ? "creator" : "joiner";
    console.log(User);
    if (User.username === room["room-name"] && room["status"] === "100") { // creator / status 100 (game is not started)
        User.side = "w";
        pusherChannel = connectToPusher(User.roomName, User.username, () => { // connect to pusher, subscribe to channel, create events loccaly
            createEvents(User.roomName, User.username, () => { // create events in server for channel
            }) 
        });
        setEventsRecorder(pusherChannel)
        const data = createDataConfig() // create data config for game
        getGameData(User.roomName, (res) => { // get data config for game
            if (res == "[]") { // if data config not exist
                createGameData(User.roomName, data, () => { // put data in phpmyadmin;
                    loadMassagesHTML(data.chat.messages, User.username); // load messages from chat in html
                    map = data.chess.map;
                    createGameHTML(map, "w", User.roomName); // load game in html
                    gameStarted = false;
                })
            
            } else { // if data config exist
                loadMassagesHTML(data.chat.messages, User.username); // load messages from chat in html
                map = data.chess.map;
                createGameHTML(map, "w", User.roomName); // load game in html
                gameStarted = false;
            }
        })
    }

    else if(User.username === room["user-name"] && room["status"] === "101") { // joiner / status 101 (game is started)
        User.side = "b";
        pusherChannel = connectToPusher(User.roomName, User.username, () => { // connect to pusher, subscribe to channel, create events loccaly
        });
        setEventsRecorder(pusherChannel)
        changeRoom(room["room-name"],room["user-name"], "102", room.password, () => { // change room status to 102 (game is started)
            getGameData(User.roomName, (res) =>{ // get data config for game
                const roomData = JSON.parse(JSON.parse(res)[0].data);
                loadMassagesHTML(roomData.chat.messages, User.username); // load messages from chat in html
                map = roomData.chess.map;
                createGameHTML(map, User.username == room["room-name"] ? "w" : "b", User.roomName); // load game in html
    
                // joiner is in room
                triggerEventPusher(User.roomName, "joiner-joined", User.username)// trigger event for creator
            }) 
        })

    }

    else if((User.username === room["room-name"] || User.username === room["user-name"]) && room["status"] === "102") { // joiner / status 101 (game is started)
        User.side = User.username === room["room-name"] ? "w" : "b";
        pusherChannel = connectToPusher(User.roomName, User.username, () => { // connect to pusher, subscribe to channel, create events loccaly
        });
        setEventsRecorder(pusherChannel)
        getGameData(User.roomName, (res) =>{ // get data config for game
            const roomData = JSON.parse(JSON.parse(res)[0].data);
            loadMassagesHTML(roomData.chat.messages, User.username); // load messages from chat in html
            map = roomData.chess.map;
            createGameHTML(map, User.username == room["room-name"] ? "w" : "b", User.roomName); // load game in html

            // joiner is in room
            triggerEventPusher(User.roomName, "rejoin", '')// trigger event for creator
        }) 
    }
    else {
        // user is not in room
        console.log("asdasdobjectasdasdobjectasdasdobjectasdasdobjectasdasdobjectasdasdobjectasdasdobjectasdasdobject");
        // window.location.href = CLIENT_URL + "/public/pages/main-autorised.html";
    }
})


document.getElementById('chat-send').addEventListener("click", ()=>{
    const message = document.getElementById('chat-input').value;
    if (message !== "") {
        document.getElementById('chat-input').value = "";
        // safe message in phpmyadmin
        getGameData(User.roomName, (res) =>{ // get data config for game
            const data = JSON.parse(res)[0];
            const roomData = JSON.parse(data.data);
            roomData.chat.messages.push({
                name: User.username,
                message: message
            });
            updateGameData(User.roomName, roomData, () => { // put data in phpmyadmin
            });

            sendMessageToPusher(User.roomName, JSON.stringify({ // send message to pusher
                name: User.username,
                message: message
            }));
        })

    }
})

document.getElementById('draw').addEventListener("click", (e)=>{
    e.preventDefault();
    swal({
        title: "Are you sure?",
        text: "Do you really want a draw?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (drawCount == 0 && willDelete) {
            triggerEventPusher(User.roomName, "draw-ask", User.username)// trigger event
            drawCount++;
        }
    });
})

document.getElementById('resign').addEventListener("click", (e)=>{
    e.preventDefault();
    swal({
        title: "Are you sure?",
        text: "You will lose the game!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete){
            triggerEventPusher(User.roomName, "resign", User.username)// trigger event
        }
    });
})

function leaveRoom(roomName){
    window.localStorage.removeItem("room");
    deleteRoom(roomName, () => {
        deleteGameData(roomName, () => {
            window.location.href = CLIENT_URL + "/pages/main-autorised.html";
        })
    })
}

function setEventsRecorder (){
    pusherChannel.bind('draw-ask', function(data) { // listen event from creator
        if (data.message !== User.username) {
            swal({
                title: "Draw?",
                text: "Your opponent wants to draw",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    triggerEventPusher(User.roomName, "draw-accept", User.username)// trigger event
                } else {
                    triggerEventPusher(User.roomName, "draw-decline", User.username)// trigger event
                }
            });

        }
    });
    pusherChannel.bind('draw-accept', function(data) { // listen event from joiner
        if (data.message !== User.username) {
            swal("Draw!", "Your opponent accepted draw!", "success");
            leaveRoom(User.roomName)
            // leave game
        }
        else {
            swal("Draw!", "You accepted draw!", "success");
            leaveRoom(User.roomName)
            // leave game
        } 
    });

    pusherChannel.bind('draw-decline', function(data) { // listen event from joiner
        if (data.message !== User.username) {
            swal("Your opponent declined draw!", "You cannot no more ask for draw in this game", "error");
            leaveRoom(User.roomName)
            // leave game
        }
    });

    pusherChannel.bind('resign', function(data) { // listen event from joiner
        if (data.message !== User.username) {
            swal("Your opponent resigned!", "You won!", "success");
        }
        leaveRoom(User.roomName)
        // leave game

    });

    pusherChannel.bind('joiner-joined', function(data) { // listen event from joiner
        if (data.message !== User.username) {
            swal(`Your opponent ${data.message} joined!`, "The game started!", "success");
            if (gameStarted == false) {
                gameStarted = true;
                triggerEventPusher(User.roomName, "game-started", User.username)// trigger event
            }
        }
    });
    pusherChannel.bind('move', function(data) { // listen event from joiner
        data = JSON.parse(data.message);
        getGameData(User.roomName, (res) =>{ // get data config for game
            let fullData = res;
            res = JSON.parse(res)[0].data
            res = JSON.parse(res)
            res.chess.map = data
            res = JSON.stringify(res)
            fullData = JSON.parse(fullData)[0]
        })
        // updateGameData(User.roomName, data, () => {});
        // put data in phpmyadmin
        if (data.color !== User.side) {
            movePieceLocaly(document.getElementById("pos-"+data.from) , data)
        }
    }); 
    pusherChannel.bind('game-started', function(data) { // listen event from joiner
        gameStarted = true;
        
    });
}

