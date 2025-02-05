import { triggerEventPusher } from "./pusher.js";
const chess = new Chess();
let selectedSquereHTML = '';
let selectedPieceHTML = '';
let selectedToMoveHTML = [];
const alfabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function createGameHTML(fen, side, roomName){
    chess.load(fen);
    const map = chess.board();
    document.getElementById("turn").innerHTML = chess.turn() == 'w' ? 'White' : 'Black';
    for (let i = 0; i < 8; i++) {
        const row = document.createElement("div");
        row.id = "row-"+i;
        row.className = "row";
        document.getElementById("board").appendChild(row);
        for (let j = 0; j < 8; j++) {
            const square = document.createElement("div");
            square.id = `${alfabet[j]}${8 - i}`;
            square.className = (i + j) % 2 == 0 ? "white-square square" : "black-square square";
            // square.addEventListener('click', () => movePiece(square, square.id));
            document.getElementById("row-"+i).appendChild(square);
        }
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (map[i][j] != null) {
                const piece = document.createElement("div");
                piece.className = "piece";
                piece.classList.add("piece-"+map[i][j].type, map[i][j].color);
                piece.id = `pos-${alfabet[j]}${8 - i}`;
                piece.addEventListener('click', () => pieceClick(piece, map[i][j], side, roomName));
                document.getElementById(`${alfabet[j]}${8 - i}`).appendChild(piece);  
            }
        }
    }
}

function pieceClick(piece, pieceData, side, roomName){
    const moves = chess.moves({ square: piece.id.slice(4), verbose: true});
    if (selectedPieceHTML.length != 0) {
        for (let i = 0; i < selectedToMoveHTML.length; i++) {
            selectedToMoveHTML[i].classList.remove('selected-to-move');
        selectedToMoveHTML[i].removeChild(selectedToMoveHTML[i].childNodes[0]);
            
        }
        selectedToMoveHTML = [];
    }

    if (selectedPieceHTML != '') {
        selectedSquereHTML.classList.remove('selected');
    }
    if (piece.classList.contains(side)) {
        selectedPieceHTML = piece;
        selectedSquereHTML = document.getElementById(piece.id.slice(4));
        selectedSquereHTML.classList.add('selected');
        if (moves.length != 0) {
            for (let i = 0; i < moves.length; i++) {
                selectedToMoveHTML.push(document.getElementById(moves[i].to));
                selectedToMoveHTML[i].classList.add('selected-to-move');
                const d = document.createElement("div");
                d.className = "selected-to-move-dot";
                selectedToMoveHTML[i].appendChild(d);
                selectedToMoveHTML[i].addEventListener('click', () => movePiece(piece, moves[i], selectedToMoveHTML[i],roomName));
            }
        }
    }
}


export function movePiece(piece, pieceData, toSquere, roomName){
    if (toSquere) {
        movePieceLocaly(piece ,pieceData)
        // document.getElementById("turn").innerHTML = chess.turn() == 'w' ? 'White' : 'Black';
        triggerEventPusher(roomName, 'move',JSON.stringify(pieceData));
    }   
}

export function movePieceLocaly(piece, pieceData){
    document.getElementById("turn").innerHTML = chess.turn() == 'b' ? 'White' : 'Black';
    if (selectedSquereHTML.length != 0) {
        selectedSquereHTML.classList.remove('selected');
    }
    chess.move({ from: pieceData.from, to: pieceData.to });

    const newPiece = piece;
    newPiece.id = `pos-${pieceData.to}`;
    piece.remove();
    document.getElementById(pieceData.to).appendChild(newPiece);
    for (let i = 0; i < selectedToMoveHTML.length; i++) {
        selectedToMoveHTML[i].classList.remove('selected-to-move');
        selectedToMoveHTML[i].removeChild(selectedToMoveHTML[i].childNodes[0]);
    }
    selectedToMoveHTML = [];
}
