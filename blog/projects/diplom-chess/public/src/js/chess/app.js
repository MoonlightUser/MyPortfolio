import { Pawn, Rook, King, Knight, Bishop, Queen } from "./pieces.js";
createHtmlBoard();
const squaresHTML = getSquaresHTML(); 
const squares = getSquaresId(squaresHTML);
console.log(squares);
const map = [
    ['R', 'K', 'B', 'Q', 'K', 'B', 'K', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'K', 'B', 'Q', 'K', 'B', 'K', 'R']
]
addPiecesToMap()


function addPiecesToMap() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const piece = map[i][j];
            const square = document.getElementById(`${i+1}-${j+1}`);
            if (piece) {
                console.log(piece);
                const newPiece = null;
                if (piece === 'P') {
                    const newPiece = new Pawn('white', i+1, j+1);
                }
                else if (piece === 'R') {
                    const newPiece = new Rook('white', i+1, j+1);
                }
                else if (piece === 'K') {
                    const newPiece = new Knight('white', i+1, j+1);
                }
                else if (piece === 'B') {
                    const newPiece = new Bishop('white', i+1, j+1);
                }
                else if (piece === 'Q') {
                    const newPiece = new Queen('white', i+1, j+1);
                }
                else if (piece === 'K') {
                    const newPiece = new King('white', i+1, j+1);
                }
                square.appendChild(newPiece.render());
            }
        }
    }
}

function createHtmlBoard() {  
    for (let i = 0; i < 8; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        row.id = i;
        document.getElementById("board").appendChild(row);
        for (let j = 0; j < 8; j++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.classList.add((i+j)%2 === 0 ? "white" : "black");
            square.id = `${i+1}-${j+1}` ;
            row.appendChild(square);
        }
    }
}

function getSquaresHTML() {
    return document.querySelectorAll(".square");
}

function getSquaresId(masiveHTML) {
    const squares = [];
    for (let i = 0; i < masiveHTML.length; i++) {
        const square = squaresHTML[i];
        squares.push(square.id);
    }
    return squares;
}

