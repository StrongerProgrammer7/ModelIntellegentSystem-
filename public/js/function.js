// @ts-nocheck
let old = null;

function movePiece(e) //click mouse by piece and make step , this start
{
    let piece = e.target;
    const row = parseInt(piece.getAttribute("row"));
    const column = parseInt(piece.getAttribute("column"));
    let p = new Piece(row, column);
  
    if (capturedPosition.length > 0) {
      enableToCapture(p);
    } else {
      if (posNewPosition.length > 0) {
        enableToMove(p);
      }
    }
  
    if (currentPlayer === board[row][column]) {
      let player = reverse(currentPlayer);
      if (!findPieceCaptured(p, player)) {
        findPossibleNewPosition(p, player);
      }
    }
}

function movePieceAI(oldPos,newPos,captured) // this start for AI
{
    let p = new Piece(oldPos.row, oldPos.column);

    if(captured.row!==undefined )
    {
      //EAT enemy
      enableToCaptureAI(newPos,oldPos,captured);
    }else
    {
      //Simple move
      moveThePieceAI(newPos,oldPos);
    }
  
}


  function enableToCaptureAI(newPos,oldPos,captured) 
  {
  
      board[newPos.row][newPos.col] = currentPlayer; 
      board[oldPos.row][oldPos.col] = 0;
      board[captured.row][captured.col] = 0; 
 
  
      readyToMove = null;
      capturedPosition = [];
      posNewPosition = [];
      displayCurrentPlayer();
      builBoard();
      currentPlayer = reverse(currentPlayer);
  }
  

function moveThePieceAI(newPosition,oldPost) 
{
  // if the current piece can move on, edit the board and rebuild
  board[newPosition.row][newPosition.col] = currentPlayer;
  board[oldPost.row][oldPost.col] = 0;

  // init value
  readyToMove = null;
  posNewPosition = [];
  capturedPosition = [];

  currentPlayer = reverse(currentPlayer);

  displayCurrentPlayer();
  builBoard();

}
  
  function enableToCapture(p) 
  {
    let find = false;
    let pos = null;
    capturedPosition.forEach((element) => 
    {
      if (element.newPosition.compare(p)) 
      {
        find = true;
        pos = element.newPosition;
        old = element.pieceCaptured;
        return;
      }
    });
  
    if (find) {
      // if the current piece can move on, edit the board and rebuild
      board[pos.row][pos.column] = currentPlayer; // move the piece
      board[readyToMove.row][readyToMove.column] = 0; // delete the old position
      // delete the piece that had been captured
      board[old.row][old.column] = 0;
  
      // reinit ready to move value
  
      readyToMove = null;
      capturedPosition = [];
      posNewPosition = [];
      displayCurrentPlayer();
      builBoard();
      // check if there are possibility to capture other piece
      currentPlayer = reverse(currentPlayer);
    } else 
      builBoard();
    
  }
  
  function enableToMove(p) 
  {

    let find = false;
    let newPosition = null;
    // check if the case where the player play the selected piece can move on
    posNewPosition.forEach((element) => {
      if (element.compare(p)) {
        find = true;
        newPosition = element;
        return;
      }
    });
  
    if (find) moveThePiece(newPosition);
    else builBoard();
  }
  
  async function moveThePiece(newPosition) 
  {
    // if the current piece can move on, edit the board and rebuild
    board[newPosition.row][newPosition.column] = currentPlayer;
    board[readyToMove.row][readyToMove.column] = 0;
  
    // init value
    readyToMove = null;
    posNewPosition = [];
    capturedPosition = [];
  
    currentPlayer = reverse(currentPlayer);
  
    displayCurrentPlayer();
    builBoard();
    if(currentPlayer===enemy)
    {
      console.log('step enemy :>> ', currentPlayer);
      await moveEnemy();
    }
  }
  async function moveEnemy()
  {
      const data =
      {
        board:board
      };
      await fetch("/api/stepAI",
      {
        method: 'POST',
        headers:
        {
          'Content-Type': 'application/json'
        }
      }).then(data => data.json())
      .then(data =>
        {
          board = data.board;
          let oldPos = data.oldPos;
          let newPos = data.newPos;
          let captured = data.captured;
          movePieceAI(oldPos,newPos,captured);
        })
  }
  
  function findPossibleNewPosition(piece, player) 
  {
    if (board[piece.row + player][piece.column + 1] === 0) {
      readyToMove = piece;
      markPossiblePosition(piece, player, 1);
    }
  
    if (board[piece.row + player][piece.column - 1] === 0) {
      readyToMove = piece;
      markPossiblePosition(piece, player, -1);
    }
  }
  
  function markPossiblePosition(p, player = 0, direction = 0) {
    attribute = parseInt(p.row + player) + "-" + parseInt(p.column + direction);
  
    position = document.querySelector("[data-position='" + attribute + "']");
    if (position) {
      position.style.background = "green";
      // // save where it can move
      posNewPosition.push(new Piece(p.row + player, p.column + direction));
    }
  }
  
  function builBoard() 
  {
    game.innerHTML = "";
    let black = 0;
    let white = 0;
    for (let i = 0; i < board.length; i++) 
    {
      const element = board[i];
      let row = document.createElement("div"); // create div for each row
      row.setAttribute("class", "row");
  
      for (let j = 0; j < element.length; j++) 
      {
        const elmt = element[j];
        let col = document.createElement("div"); // create div for each case
        let piece = document.createElement("div");
        let caseType = "";
        let occupied = "";
  
        if (i % 2 === 0) {
          if (j % 2 === 0) {
            caseType = "Whitecase";
          } else {
            caseType = "blackCase";
          }
        } else {
          if (j % 2 !== 0) {
            caseType = "Whitecase";
          } else {
            caseType = "blackCase";
          }
        }
  
        // добавьте шашку, если ящик не пуст
        if (board[i][j] === 1) 
            occupied = "whitePiece";
        else if (board[i][j] === -1) 
            occupied = "blackPiece";
        else 
            occupied = "empty";
        
  
        piece.setAttribute("class", "occupied " + occupied);
  
        // set row and colum in the case
        piece.setAttribute("row", i);
        piece.setAttribute("column", j);
        piece.setAttribute("data-position", i + "-" + j);
  
        //add event listener to each piece
        piece.addEventListener("click", movePiece);
  
        col.appendChild(piece);
  
        col.setAttribute("class", "column " + caseType);
        row.appendChild(col);
  
        // counter number of each piece
        if (board[i][j] === -1) 
        {
          black++;
        } else if (board[i][j] === 1) 
        {
          white++;
        }
  
        //display the number of piece for each player
        displayCounter(black, white);
      }
      
      game.appendChild(row);
    }
   
    if (black === 0 || white === 0) 
    {
      modalOpen(black);
    }
  }


  
  function displayCurrentPlayer() {
    var container = document.getElementById("next-player");
    if (container?.classList.contains("whitePiece")) {
      container.setAttribute("class", "occupied blackPiece ");
    } else {
      container.setAttribute("class", "occupied whitePiece");
    }
  }
  
  function findPieceCaptured(p, player) {
    let found = false;
    let column = p.column;
    let row = p.row;
    let countRow = board.length;
    let countCol = board[0].length;
    let pieceCaptured = null;
    if (((row - 1 >= 0 && column -1 >=0) || (row - 2 >= 0 && column - 2 >=0) ) &&
      board[row - 1][column - 1] === player &&
      board[row - 2][column - 2] === 0
    ) {
      found = true;
      newPosition = new Piece(p.row - 2, p.column - 2);
      // save the new position and the opponent's piece position
      pieceCaptured = new Piece(p.row - 1, p.column - 1);
    }
  
    if (((row - 1 >= 0 && column + 1 < countCol) || (row - 2 >= 0 && column  + 2 < countCol)) &&
      board[row - 1][column + 1] === player &&
      board[row - 2][column + 2] === 0
    ) {
      found = true;
      newPosition = new Piece(p.row - 2, p.column + 2);
      // save the new position and the opponent's piece position
      pieceCaptured = new Piece(p.row - 1, p.column + 1);
    }
  
    if (((row + 1 < countRow && column - 1 >= 0) || (row + 2 < countRow && column  - 2 >= 0)) &&
      board[row + 1][column - 1] === player &&
      board[row + 2][column - 2] === 0
    ) {
      found = true;
      newPosition = new Piece(p.row + 2, p.column - 2);
      // save the new position and the opponent's piece position
      pieceCaptured = new Piece(p.row + 1, p.column - 1);
    }
  
    if (((row + 1 < countRow && column + 1 < countCol) || (row + 2 < countRow && column  + 2 < countCol)) &&
      board[row + 1][column + 1] === player &&
      board[row + 2][column + 2] === 0
    ) {
      found = true;
      newPosition = new Piece(p.row + 2, p.column + 2);
      
      // save the new position and the opponent's piece position
      pieceCaptured = new Piece(p.row + 1, p.column + 1);
    }
    if(found)
    {
        readyToMove = p;
        markPossiblePosition(newPosition);
        capturedPosition.push({
            newPosition: newPosition,
            pieceCaptured: pieceCaptured,
          });
    }
    
    return found;
  }
  
  function displayCounter(black, white) 
  {
    var blackContainer = document.getElementById("black-player-count-pieces");
    var whiteContainer = document.getElementById("white-player-count-pieces");
    blackContainer.innerHTML = black;
    whiteContainer.innerHTML = white;
  }
  
  function modalOpen(black) 
  {
    document.getElementById("winner").innerHTML = black === 0 ? "White" : "Black";
    document.getElementById("loser").innerHTML = black !== 0 ? "White" : "Black";
    modal.classList.add("effect");
  }
  
  function modalClose() 
  {
    modal.classList.remove("effect");
  }
  
  function reverse(player) 
  {
    return player === -1 ? 1 : -1;
  }