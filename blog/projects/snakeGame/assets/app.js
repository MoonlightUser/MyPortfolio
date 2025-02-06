const m = 30 // 1m = 30px 
let endFlag = false

const map = {
    x: 11,
    y: 11
}

let keyNow = "w" // this varible will show what key was clicked
let snake_body_position = { //start position of snake head
    x: 5*m,
    y: 5*m
}

let apple_position = { //start position of apple
    x: 5*m, 
    y: 2*m
}

let snake_body_new = [snake_body_position]
let snake_body_old = [snake_body_position]

const snake_head = document.createElement("div") //create and render the snake head
snake_head.id = "snake_HEAD"
snake_head.className = "snake"
snake_head.style.top = `${snake_body_new[0].x}px`
snake_head.style.left = `${snake_body_new[0].y}px `
document.body.appendChild(snake_head)

const apple = document.createElement("div") //create and render the apple
apple.id = "apple_id"
apple.className = "apple"
apple.style.top = `${apple_position.y}px`
apple.style.left = `${apple_position.x}px `
document.body.appendChild(apple)

for (let y = 0; y < map.y; y++){ //render map in hight
    let paddingTop = y * m
    let newAreaW = document.createElement("div")
    newAreaW.className = "map"
    newAreaW.style.top = `${paddingTop}px`
    document.body.appendChild(newAreaW)

    for (let x = 0; x < map.x; x++){ //render map in weidth
        let paddingLeft = x * m
        let newAreaH = document.createElement("div")
        newAreaH.className = "map"
        newAreaH.style.top = `${paddingTop}px`
        newAreaH.style.left = `${paddingLeft}px` 
        document.body.appendChild(newAreaH)
    }
}

let snake_body = document.createElement("div") //create and render the snake body
snake_body.id = `snake_BODY_${snake_body_new.length}`
snake_body.className = "snake_b"
snake_body.style.top = `${snake_body_old.at(-1).y}px`
snake_body.style.left = `${snake_body_old.at(-1).x}px `
document.body.appendChild(snake_body)
snake_body_position = {
    x: snake_body_old.at(-1).x,
    y: snake_body_old.at(-1).y
}
snake_body_new.push(snake_body_position)
snake_body_old.push(snake_body_position)

document.addEventListener("keydown", (key) =>{
    if (`${key.key}` == "w" || `${key.key}` == "W" || `${key.key}` == "ArrowUp"){
        keyNow = "w"
    }
    else if (`${key.key}` == "a" || `${key.key}` == "A" || `${key.key}` == "ArrowLeft"){
        keyNow = "a"
    }
    else if (`${key.key}` == "d" || `${key.key}` == "D" || `${key.key}` == "ArrowRight"){
        keyNow = "d"
    }
    else if (`${key.key}` == "s" || `${key.key}` == "S" || `${key.key}` == "ArrowDown"){
        keyNow = "s"
    }
})

function checkAppple(){ //if apple was eaten by head of snake we use changeApple()
    if (snake_body_new[0].y == apple_position.y && snake_body_new[0].x == apple_position.x){
        console.log("numnum");
        changeApple()
    }
}

function checkEndOfGame(){
    if (snake_body_new[0].x < 0 || snake_body_new[0].x > (map.x - 1)*m || snake_body_new[0].y < 0 || snake_body_new[0].y >  (map.y - 1)*m){
        endOfGame()
        return true
    }
    else{
        return false
    }
}

function changeHeadPosition(){
    if (keyNow == "w"){
        for (let k in snake_body_new){
            if (snake_body_new[k].x == snake_body_new.at(-1).x && snake_body_new[k].y == snake_body_new.at(-1).y){

            }
            else if (snake_body_new[k].x == snake_body_new[0].x && snake_body_new[k].y == snake_body_new[0].y - m){
                endOfGame()
            }
        }
        snake_body_new[0].y -= m
        document.getElementById("snake_HEAD").style.transform = "rotate(-90deg)"
    }
    else if (keyNow == "a"){
        for (let k in snake_body_new){
            if (snake_body_new[k].x == snake_body_new.at(-1).x && snake_body_new[k].y == snake_body_new.at(-1).y){

            }
            else if (snake_body_new[k].x == snake_body_new[0].x-m && snake_body_new[k].y == snake_body_new[0].y){
                endOfGame()
            }
        }
        snake_body_new[0].x -= m
        document.getElementById("snake_HEAD").style.transform = "rotate(-180deg)"
    }
    else if (keyNow == "d"){
        for (let k in snake_body_new){
            if (snake_body_new[k].x == snake_body_new.at(-1).x && snake_body_new[k].y == snake_body_new.at(-1).y){

            }
            else if (snake_body_new[k].x == snake_body_new[0].x+m && snake_body_new[k].y == snake_body_new[0].y){
                endOfGame()
            }
        }
        snake_body_new[0].x += m
        document.getElementById("snake_HEAD").style.transform = "rotate(0deg)"

    }
    else if (keyNow == "s"){
        for (let k in snake_body_new){
            if (snake_body_new[k].x == snake_body_new.at(-1).x && snake_body_new[k].y == snake_body_new.at(-1).y){

            }
            else if (snake_body_new[k].x == snake_body_new[0].x && snake_body_new[k].y == snake_body_new[0].y + m){
                endOfGame()
            }
        }
        snake_body_new[0].y += m
        document.getElementById("snake_HEAD").style.transform = "rotate(90deg)"
    }
    checkAppple()
}

function changeBodyPosiion(){

}

function renderSnake(){//render the snake
    let snake_head = document.getElementById("snake_HEAD")
    snake_head.style.top = `${snake_body_new[0].y}px`
    snake_head.style.left = `${snake_body_new[0].x}px`
    document.body.appendChild(snake_head)
}

function changeApple(){ //change apple position on random
    let localFlag = true
    while(localFlag){
        apple_position = {
            x: Math.floor(Math.random() * map.x)*m,
            y: Math.floor(Math.random() * map.y)*m
        }
        if (snake_body_new.length != map.x * map.y){
            for (let k in snake_body_new){
                if (snake_body_new[k].x != apple_position.x || snake_body_new[k].y != apple_position.y){
                    localFlag = false
                }
                else{
                    localFlag = true
                    break
                }
    
            } 
        }
        else{
            localFlag = false
        }
    }
    apple.style.top = `${apple_position.y}px`
    apple.style.left = `${apple_position.x}px `
    document.body.appendChild(apple)
    newBodySnake()
}

function renderBody(){
    if (snake_body_new.length != 1){
        for(let g = 1; g < snake_body_new.length; g++){
            let snake_body = document.getElementById(`snake_BODY_${g}`) //create and render the snake head
            snake_body.style.top = `${snake_body_old[g-1].y}px`
            snake_body.style.left = `${snake_body_old[g-1].x}px`
            document.body.appendChild(snake_body)
            snake_body_new[g] = {
                x: snake_body_old[g-1].x,
                y: snake_body_old[g-1].y
            }
            
            
        }
    }
}

function newBodySnake(){
    let snake_body = document.createElement("div") //create and render the snake head
    snake_body.id = `snake_BODY_${snake_body_new.length}`
    snake_body.className = "snake_b"
    snake_body.style.top = `${snake_body_old.at(-1).y}px`
    snake_body.style.left = `${snake_body_old.at(-1).x}px `
    document.body.appendChild(snake_body)
    let snake_body_position = {
        x: snake_body_old.at(-1).x,
        y: snake_body_old.at(-1).y
    }
    snake_body_new.push(snake_body_position)
    snake_body_old.push(snake_body_position)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function endOfGame(){
    if (snake_body_new.length - 1 == map.x * map.y){
        document.getElementsByTagName("h1")[0].style.visibility = "visible"
        document.getElementsByTagName("h1")[0].innerHTML = "YOU WIN"
    }
    else{
        document.getElementsByTagName("h1")[0].style.visibility = "visible"
    }
    endFlag = true
}

function renderBodyTexture(){
    if (snake_body_new.length != 2){
        for(let g = 2; g < snake_body_new.length; g++){
            // for less harder code
            let nowB = snake_body_new[g]
            let beforeB = snake_body_new[g - 1]
            let afterB = snake_body_new[g + 1]

            let snake_body = document.getElementById(`snake_BODY_${g}`)
            if (snake_body_new.at(-1) == snake_body_new[g]){
                snake_body.style.content = ("url(./img/tail.png)")
                if (nowB.x == beforeB.x && nowB.y > beforeB.y){
                    snake_body.style.transform = "rotate(180deg)"
                }
                else if (nowB.x == beforeB.x && nowB.y < beforeB.y){
                    snake_body.style.transform = "rotate(0deg)"
                }
                else if (nowB.x > beforeB.x && nowB.y == beforeB.y){
                    snake_body.style.transform = "rotate(90deg)"
                }
                else{
                    snake_body.style.transform = "rotate(-90deg)"
                }
            }
            else {
                snake_body.style.transform = "rotate(0deg)"
                if (nowB.x == beforeB.x && nowB.x == afterB.x){
                    snake_body.style.content = ("url(./img/body.png)")
                    snake_body.style.transform = "rotate(90deg)"
                }
                else if (nowB.y == beforeB.y && nowB.y == afterB.y){
                    snake_body.style.content = ("url(./img/body.png)")
                    snake_body.style.transform = "rotate(0deg)"
                }
                else{
                    snake_body.style.content = "url(./img/bodyRotate.png)"
                    if (nowB.x == beforeB.x && nowB.y > beforeB.y && nowB.x > afterB.x){
                        snake_body.style.transform = "rotate(-180deg)"
                    }
                    else if (nowB.x == beforeB.x && nowB.y > beforeB.y && nowB.x < afterB.x){
                        snake_body.style.transform = "rotate(-90deg)"
                    }
                    else if (nowB.x > beforeB.x && nowB.y == beforeB.y  && nowB.y > afterB.y){
                        snake_body.style.transform = "rotate(180deg)"
                    }
                    else if(nowB.x > beforeB.x && nowB.y == beforeB.y  && nowB.y < afterB.y){
                        snake_body.style.transform = "rotate(90deg)"
                    }
                    else if(nowB.x < beforeB.x && nowB.y == beforeB.y  && nowB.y < afterB.y){
                        snake_body.style.transform = "rotate(0deg)"
                    }
                    else if(nowB.x < beforeB.x && nowB.y == beforeB.y  && nowB.y > afterB.y){
                        snake_body.style.transform = "rotate(-90deg)"
                    }
                    else if (nowB.x == beforeB.x && nowB.y < beforeB.y && nowB.x < afterB.x){
                        console.log("object"); 
                        snake_body.style.transform = "rotate(0deg)"
                    }
                    else{
                        snake_body.style.transform = "rotate(90deg)"
                    }
                }

            }
        }
    }
}

async function start(){
    while(!endFlag){
        await sleep(400)
        for (let o in snake_body_old){
            snake_body_old[o].x = snake_body_new[o].x
            snake_body_old[o].y = snake_body_new[o].y
        }
        changeHeadPosition()
        if (checkEndOfGame()){}
        else{
            renderBody()
            renderBodyTexture()
            renderSnake()                
        }
    }    
}
start()
