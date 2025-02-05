const express = require('express')
const path = require('path');
const app = express()
const Pusher = require('pusher')
const bodyParser = require('body-parser')
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const mysql = require('mysql2');
const $ = require('jquery')(dom.window)
const constraints = {
    username: {
        length: {
            minimum: 3,
            maximum: 20,
        }
    },
    password: {
        length: {
            minimum: 6,
        }
    },
};


// const CLIENT_URL = "https://diplom.tymurblog.com"; // production url
const CLIENT_URL = "http://localhost:3003" // development url
// const PHP_URL = 'https://diplom.tymurblog.com/diplom-chess' // production url
const PHP_URL = 'http://chess_php' // development url

//php urls
const CREATE_TOKEN_URL = '/create-token.php'
const READ_TOKEN_URL = '/read-token.php'
const GET_USERS_URL = '/get-users.php'
const ADD_USER_URL = '/add-user.php'
const GET_ROOM_URL = '/rooms/get-room.php'
const GET_ROOMS_URL = '/rooms/get-rooms.php'
const CREATE_ROOM_URL = '/rooms/create-room.php'
const CHANGE_ROOM_URL = '/rooms/change-room.php'
const CHANGE_ROOM_FULLY_URL = '/rooms/change-room-fully.php'
const DELETE_ROOM_URL = '/rooms/delete-room.php'
const CREATE_GAME_DATA_URL = '/game-data/create-game-data.php'
const GET_GAME_DATA_URL = '/game-data/get-game-data.php'
const UPDATE_GAME_DATA_URL = '/game-data/update-game-data.php'
const DELETE_GAME_DATA_URL = '/game-data/delete-game-data.php'


// pusher config
const pusher = new Pusher({
    appId: "1563257",
    key: "37167ed4b28138b6fe32",
    secret: "658bc35f8bdb05da7595",
    cluster: "eu",
    useTLS: true
});

app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    console.log("Just got a request to get users!")
    $.ajax({
        url: PHP_URL+GET_USERS_URL,
        method:'post',
        success: function (response) {
            console.log("success in get-users");
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in get-users");
            console.log(xhr);
            res.send(xhr)
        }
    });
})


app.post('/create-token', (req, res) => {
    console.log("Just got a request to create token!") 
    const username = JSON.stringify(req.body.username);
    const password = JSON.stringify(req.body.password);
    $.ajax({
        url: PHP_URL+CREATE_TOKEN_URL,
        method:'post',
        data: { username, password},
        success: function (response) {
            console.log("success in create-token");
            console.log(response);
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in create-token");
            console.log(xhr);
            res.send(xhr)
        }
    });
})

app.post('/read-token', (req, res) => {
    console.log("Just got a request to read token!") 
    const token = req.body.token
    $.ajax({
        url: PHP_URL+READ_TOKEN_URL,
        method:'post',
        data: { token},
        success: function (response) {
            console.log("success in read-token");
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in read-token");
            console.log(xhr);
            res.send(xhr)
        }
    });
})

app.post('/get-users', (req, res) => {
    console.log("Just got a request to get users!")
    $.ajax({
        url: PHP_URL+GET_USERS_URL,
        method:'post',
        success: function (response) {
            console.log("success in get-users");
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in get-users");
            console.log(xhr);
            res.send(xhr)
        }
    });
})

app.post('/add-user', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let repeatPassword = req.body.repeatPassword
    let email = req.body.email
    console.log("Just got a request to add user!");
    console.log("username: " + username);
    console.log("password: " + password);
    console.log("repeatPassword: " + repeatPassword);
    console.log("email: " + email);
    console.log(constraints);

    // validation
    if (password.length < constraints.password.length.minimum || password.length > constraints.password.length.maximum) {
        console.log("password is not valid");
        res.send("4")
    }
    else if (password !== repeatPassword) {
        console.log("passwords do not match");
        res.send("3")
    }
    else if (username.length < constraints.username.length.minimum) {
        console.log("username is not valid");
        res.send("5")
    }
    else if (!email.includes("@")) {
        console.log("email is not valid");
        res.send("6")
    }
    else {
        $.ajax({
            url: PHP_URL+GET_USERS_URL,
            method:'post',
            success: function (response) {
                console.log("success in get-users");
                const users = JSON.parse(response);
                let isUserValid = true;
                for(let i = 0; i < users.length; i++) {
                    if (users[i].name === username) {
                        console.log("username is already taken");
                        res.send("2")
                        isUserValid = false;
                        break;
                    }
                    else if (users[i].email === email) {
                        console.log("email is already taken");
                        res.send("7")
                        isUserValid = false;
                        break;
                    }
                }
                if (isUserValid) {
                    $.ajax({
                        url: PHP_URL+ADD_USER_URL,
                        method:'post',
                        data: {username, password, email},
                        success: function (response) {
                            console.log("success in add-user");
                            res.send("1")
                        },
                        error: function (xhr, status, error) {
                            console.log("error in add-user");
                            console.log(xhr);
                            res.send("8")
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("error in get-users");
                console.log(xhr);
            }
        });

        // const 
    }

})

app.post('/find-user', (req, res) => {
    console.log("Just got a request to login!")
    $.ajax({
        url: PHP_URL+GET_USERS_URL,
        method:'post',
        success: function (response) {
            console.log("success in get-users");
            const users = JSON.parse(response);
            const username = req.body.username;
            const password = req.body.password;
            let isUserFouded = false;
            for (let i = 0; i < users.length; i++) {
                if (users[i].name === username && users[i].password === password) {
                    console.log("user found");
                    isUserFouded = true;
                    res.send("1")
                    break
                }
                else if (users[i].name === req.body.username && users[i].password !== req.body.password) {
                    console.log("wrong password");
                    isUserFouded = true;
                    res.send("2")
                    break
                }
            }
            if (!isUserFouded) {
                console.log("user not found");
                res.send("3")
            }
        },
        error: function (xhr, status, error) {
            console.log("error in get-users");
            console.log(xhr);
            res.send(xhr)
        }
    });
})

app.post('/check-room', (req, res) => {
    console.log("Just got a request to check room!")
    const roomName = req.body.roomName;
    console.log(roomName);
    $.ajax({
        url: PHP_URL+GET_ROOM_URL,
        method:'post',
        data: {roomName},
        success: function (response) {
            console.log(response);
            if (response === "[]") {
                console.log("no such a room"); // no room with this name
                res.send("1")
            }
            else {
                console.log("room already exists"); // room already exists
                res.send("2")
            }

        },
        error: function (xhr, status, error) {
            console.log("error"); // no room with this name
            res.send("1")
        }
    });
})

app.post('/check-join-room', (req, res) => {
    console.log("Just got a request to check room!")
    const roomName = req.body.roomName;
    const roomPassword = req.body.roomPassword;
    $.ajax({
        url: PHP_URL+GET_ROOM_URL,
        method:'post',
        data: {roomName},
        success: function (response) {
            console.log(response);  
            const room = JSON.parse(response);
            if (room == false) {
                console.log("no such a room"); // no room with this name
                res.send("2")
            }
            else if (room[0].password !== roomPassword) {
                console.log(room[0].password, roomPassword);
                console.log("password is not correct"); // password is not correct
                res.send("3")
            }
            else if (room[0].status !== "100") {
                console.log("room is not open"); // room is full
                res.send("4")
            }
            else {
                console.log("room is open"); // room is open
                res.send("1")
            }
        },
        error: function (xhr, status, error) {
            console.log("error"); // no room with this name
            res.send(xhr)
        }
    });
})

app.post('/join-room', (req, res) => {
    console.log("Just got a request to join room!")
    const roomName = req.body.roomName;
    const userName = req.body.userName;
    if (roomName === userName) {
        console.log("room name and user name are the same");
        res.send("3")
    }
    else {
        $.ajax({
            url: PHP_URL+CHANGE_ROOM_URL,
            method:'post',
            data: {roomName, userName},
            success: function (response) {
                console.log("success in join-room");
                res.send("1")
            },
            error: function (xhr, status, error) {
                console.log("error in join-room");
                console.log(xhr);
                res.send("2")
            }
        });
    }
})

app.post('/create-room', (req, res) => {
    console.log("Just got a request to create room!")
    const roomName = req.body.roomName;
    const roomPassword = req.body.roomPassword;
    //php
    $.ajax({
        url: PHP_URL+CREATE_ROOM_URL,
        method:'post',
        data: {roomName, roomPassword},
        success: function (response) {
            console.log("success in create-room");
            res.send("1")
        },
        error: function (xhr, status, error) {
            console.log("error in create-room");
            console.log(xhr);
            res.send("2")
        }
    });
})

app.post('/change-room', (req, res) => {
    console.log("Just got a request to change room!")
    const roomName = req.body.roomName;
    const userName = req.body.userName;
    const status = req.body.status;
    const password = req.body.password;
    console.log(roomName, userName, status, password);
    //php
    $.ajax({
        url: PHP_URL+CHANGE_ROOM_FULLY_URL,
        method:'post',
        data: {roomName, userName, status, password},
        success: function (response) {
            console.log("success in change-room");
            res.send("1")
        },
        error: function (xhr, status, error) {
            console.log("error in change-room");
            console.log(xhr);
            res.send("2")
        }   
    });
})

app.post('/get-room', (req, res) => {
    console.log("Just got a request to get room!")
    const roomName = req.body.roomName;
    //php
    $.ajax({
        url: PHP_URL+GET_ROOM_URL,
        method:'post',
        data: {roomName},
        success: function (response) {
            console.log("success in get-room");
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in get-room");
            console.log(xhr);
            res.send(xhr)
        }
    });
})

app.post('/create-events', (req, res) => {
    console.log("Just got a request to create events!")
    const roomName = req.body.roomName;
    console.log(roomName);
    pusher.trigger('publick-'+roomName, 'check ', {
        'message': 'hello world'
    });
    res.send("1")
})

app.post('/send-message-to-pusher', (req, res) => {
    console.log("Just got a request to send message to pusher!")
    const roomName = req.body.roomName;
    const message = req.body.message;
    console.log(roomName, message);
    pusher.trigger('publick-' + roomName, 'message', { 'message': message })
        .then(() => {
            console.log("Message sent successfully" );
            res.send("1");
        })
        .catch((error) => {
            console.error("Error sending message to Pusher:", error);
            res.status(500).send("Error sending message to Pusher");
        });
})

app.post('/trigger-event-pusher', (req, res) => {
    console.log("Just got a request to trigger event to pusher!")
    const roomName = req.body.roomName;
    const event = req.body.event;
    const data = req.body.data;
    pusher.trigger('publick-'+roomName, event, {
        'message': data
    });
    res.send("1")
})

app.post('/create-game-data', (req, res) => {
    console.log("Just got a request to create game data!")
    const roomName = req.body.roomName;
    const data = req.body.data;
    //php
    $.ajax({
        url: PHP_URL+CREATE_GAME_DATA_URL,
        method:'post',
        data: {roomName, data},
        success: function (response) {
            console.log("success in create-game-data");
            console.log(response);
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in create-game-data");
            console.log(xhr);
            res.send("2")
        }
    });
})

app.post('/get-game-data', (req, res) => {
    console.log("Just got a request to get game data!")
    const roomName = req.body.roomName;
    //php
    $.ajax({
        url: PHP_URL+GET_GAME_DATA_URL,
        method:'post',
        data: {roomName},
        success: function (response) {
            console.log("success in get-game-data");
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in get-game-data");
            console.log(xhr);
            res.send(xhr)
        }
    });
})

app.post('/update-game-data', (req, res) => {
    console.log("Just got a request to update game data!")
    const roomName = req.body.roomName;
    const data = req.body.data;
    //php
    $.ajax({
        url: PHP_URL+UPDATE_GAME_DATA_URL,
        method:'post',
        data: {roomName, data},
        success: function (response) {
            console.log("success in update-game-data");
            res.send("1")
        },
        error: function (xhr, status, error) {
            console.log("error in update-game-data");
            console.log(xhr);
            res.send("2")
        }
    });
})

app.post('/delete-game-data', (req, res) => {
    console.log("Just got a request to delete game data!")
    const roomName = req.body.roomName;
    //php
    $.ajax({
        url: PHP_URL+DELETE_GAME_DATA_URL,
        method:'post',
        data: {roomName},
        success: function (response) {
            console.log("success in delete-game-data");
            res.send("1")
        },
        error: function (xhr, status, error) {
            console.log("error in delete-game-data");
            console.log(xhr);
            res.send("2")
        }
    });
})

app.post('/delete-room', (req, res) => {
    console.log("Just got a request to delete room!")
    const roomName = req.body.roomName;
    //php
    $.ajax({
        url: PHP_URL+DELETE_ROOM_URL,
        method:'post',
        data: {roomName},
        success: function (response) {
            console.log("success in delete-room");
            res.send("1")
        },
        error: function (xhr, status, error) {
            console.log("error in delete-room");
            console.log(xhr);
            res.send("2")
        }
    });
})

app.post('/get-rooms', (req, res) => {
    console.log("Just got a request to get rooms!")
    //php
    $.ajax({
        url: PHP_URL+GET_ROOMS_URL,
        method:'post',
        success: function (response) {
            console.log("success in get-rooms");
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in get-rooms");
            console.log(xhr);
            res.send(xhr)
        }
    });
})

app.listen(3000, () => {
    console.log('Chess app listening on port 3001!')
})


