class Piece {
    constructor(color, name, row, column){
        this.color = color;
        this.name = name;
    }
    render(){
        const square = document.getElementById(`${this.row}-${this.column}`);
        const piece = document.createElement("div");
        piece.classList.add("piece");
        piece.classList.add(this.color);
        piece.classList.add(this.name);
        return piece;
    }
}

export class Pawn extends Piece {
    constructor(color, row, column){
        super(color, 'P', row, column);
    }
}

export class Rook extends Piece {
    constructor(color, row, column){
        super(color, 'R', row, column);
    }
}

export class Knight extends Piece {
    constructor(color, row, column){
        super(color, 'K', row, column);
    }
}

export class Bishop extends Piece {
    constructor(color, row, column){
        super(color, 'B', row, column);
    }
}

export class Queen extends Piece {
    constructor(color, row, column){
        super(color, 'Q', row, column);
    }
}

export class King extends Piece {
    constructor(color, row, column){
        super(color, 'K', row, column);
    }
}

