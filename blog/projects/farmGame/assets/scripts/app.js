let money = 100;
let income = 0;
const incomeOfLand = 5;
const costOfLand = 100;
const timeIncome = 2000;
landLevel = [1, 1, 1, 1, 1, 1]


function startGame(){  
    const playerName = getPlayerName();
    console.log(document.querySelector('#menu_name'))
    document.querySelector('#menu_name').innerHTML = playerName

    deleteElements("page_1")
    viewElements('page_2')
    setInterval(() => {
        money += income
        updateMoney()
        console.log(money)
    }, timeIncome)
}

function lvlUpLand(idOfLand){
    if (parseInt(landLevel[idOfLand] * costOfLand) <= money){
        let addres = '#land_' + (idOfLand) 
        money -= costOfLand * landLevel[idOfLand]
        income -= incomeOfLand * (landLevel[idOfLand] - 1)
        income += incomeOfLand * landLevel[idOfLand]
        updateMoney()
        document.querySelector(addres).style.background = "rgb(3, 64, 89)";


        landLevel[idOfLand] += 1
        document.querySelector('#lvlOf' + idOfLand).innerHTML = `up lvl:${costOfLand * landLevel[idOfLand]}£  Lvl:${landLevel[idOfLand] - 1} 
         Incoming:${incomeOfLand * (landLevel[idOfLand] - 1)}£`

    }
    else{
        alert("Not enough money")
    } 
}

function pickMoney() {
    money += 5;
    updateMoney()
}
function updateMoney(){
    document.querySelector('#menu_money').innerHTML = 'Your money: ' + money  + `£ (${income}£/5sec)`
}
function deleteElements(id){
    document.getElementById(id).remove()
}
function viewElements(id){
    document.getElementById(id).style.visibility = "visible";
}

function getPlayerName(){
    let playerName = prompt("Pls, write your name(min 3 simb. max 10simb.)");
    while (playerName.length > 10 || playerName.length < 3){
        playerName = prompt("Pls, write correct name")
    }
    return playerName
}

land_0.addEventListener('click', () => lvlUpLand(0));
land_1.addEventListener('click', () => lvlUpLand(1));
land_2.addEventListener('click', () => lvlUpLand(2));
land_3.addEventListener('click', () => lvlUpLand(3));
land_4.addEventListener('click', () => lvlUpLand(4));
land_5.addEventListener('click', () => lvlUpLand(5));

playBtn.addEventListener('click', startGame);