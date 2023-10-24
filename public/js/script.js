class Piece
{
    constructor(row,column,king=false)
    {
        this.row = row;
        this.column = column;
        this.king = king;
    }

    compare(piece)
    {
        return piece.row === this.row && piece.column === this.column;
    }

}

const modal = document.getElementById("easyModal");
let game = document.getElementById("game");
let currentPlayer = 1;
let enemy = -1;
let posNewPosition = [];
let capturedPosition = [];
let access=true;
// let board = [
//     [0, -1, 0, 0, 0, -1, 0, -1, 0, -1],
//     [-1, 0, 1, 0, -1, 0, -1, 0, -1, 0],
//     [0, 0, 0, -1, 0, -1, 0, -1, 0, -1],
//     [0, 0, -1, 0, -1, 0, -1, 0, -1, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
//     [0, 1, 0, -1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
// ];
let board = [
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
];

builBoard();

