// @ts-nocheck
let old = null;

function movePiece(e) //click mouse by piece and make step , this start
{
    let piece = e.target;
    const row = parseInt(piece.getAttribute("row"));
    const column = parseInt(piece.getAttribute("column"));
    let p;
    if(piece?.classList.contains("kingPlayer"))
        p = new Piece(row, column,true);
    else
        p = new Piece(row, column,false);
  
    if (capturedPosition.length > 0) 
        enableToCapture(p);
    else if (posNewPosition.length > 0) 
        enableToMove(p);
  
    if (currentPlayer === board[row][column] || (currentPlayer === 1 && board[row][column]===10)) 
    {
      let player = reverse(currentPlayer);
      if (!findPieceCaptured(p, player)) 
      {
        findPossibleNewPosition(p, player);
      }
    }
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
  
    if (find) 
    {
      // if the current piece can move on, edit the board and rebuild
      if(pos.king)
      {
        board[pos.row][pos.column] = 10; 
      }else
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
    // проверить, может ли игрок, играющий выбранной фигурой, двигаться дальше
    posNewPosition.forEach((element) => 
    {
      if (element.compare(p)) {
        find = true;
        newPosition = element;
        return;
      }
    });
  
    if (find) moveThePiece(newPosition,p);
    else builBoard();
  }
  
  async function moveThePiece(newPosition,isKing = false) 
  {
    // if the current piece can move on, edit the board and rebuild
    if(currentPlayer === 1 && (newPosition.row === 0 || newPosition.king))
      board[newPosition.row][newPosition.column] = 10;
    else
      board[newPosition.row][newPosition.column] = currentPlayer;
    board[readyToMove.row][readyToMove.column] = 0;
  
    // init value
    readyToMove = null;
    posNewPosition = [];
    capturedPosition = [];
  
    currentPlayer = reverse(currentPlayer);
  
    displayCurrentPlayer();
    builBoard();
    // if(currentPlayer===enemy)
    // {
    //   console.log('step enemy :>> ', currentPlayer);
    //   await moveEnemy();
    // }
  }
  
  
  function findPossibleNewPosition(piece, player) 
  {
    let row = piece.row;
    let col = piece.column;
    if(player+2===1 && piece.king === true )
    {
      
      if (row + 1  < board.length && col+1 < board[0].length && board[row + 1][col + 1] === 0) 
      {
        readyToMove = piece;
        markPossiblePosition(piece, player, 1,{row:row+1,col:col+1});
      }
    
      if (row + 1 < board.length && col-1 > 0 && board[row + 1][col - 1] === 0) 
      {
        readyToMove = piece;
        markPossiblePosition(piece, player, -1,{row:row+1,col:col-1});
      }
      if ((row + player >= 0 && row + player < board.length) && (col+1 < board[0].length) && board[row + player][col + 1] === 0) {
        readyToMove = piece;
        markPossiblePosition(piece, player, 1,{row:row-1,col:col+1});
      }
    
      if ((row + player >= 0 && row + player < board.length) && (col - 1 > 0) && board[row + player][col - 1] === 0) {
        readyToMove = piece;
        markPossiblePosition(piece, player, -1,{row:row-1,col:col-1});
      }
    }else
    {
      if ((row + player >= 0 && row + player < board.length) && (col+1 < board[0].length) && board[row + player][col + 1] === 0) {
        readyToMove = piece;
        markPossiblePosition(piece, player, 1);
      }
    
      if ((row + player >= 0 && row + player < board.length) && (col - 1 > 0) && board[row + player][col - 1] === 0) {
        readyToMove = piece;
        markPossiblePosition(piece, player, -1);
      }
    }
    
  }
  
  function markPossiblePosition(p, player = 0, direction = 0,dirKing={}) 
  {
    if(p.king === true)
    {
      attribute = parseInt(dirKing.row) + "-" + parseInt(dirKing.col);
  
      position = document.querySelector("[data-position='" + attribute + "']");
      if (position) {
        position.style.background = "green";
        // // save where it can move
        posNewPosition.push(new Piece(dirKing.row, dirKing.col,true));
      }
    }else
    {
      attribute = parseInt(p.row + player) + "-" + parseInt(p.column + direction);
  
      position = document.querySelector("[data-position='" + attribute + "']");
      if (position) {
        position.style.background = "green";
        // // save where it can move
        posNewPosition.push(new Piece(p.row + player, p.column + direction));
      }
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
        if (board[i][j] === 1 || board[i][j] === 10) 
        {
          occupied = "whitePiece";
          if(board[i][j] === 10)
          {
            occupied = occupied.concat(" kingPlayer");
          }
        }
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
        } else if (board[i][j] === 1 || board[i][j] === 10) 
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


  
  function displayCurrentPlayer() 
  {
    var container = document.getElementById("next-player");
    if (container?.classList.contains("whitePiece")) 
    {
      container.setAttribute("class", "occupied blackPiece ");
    } else 
    {
      container.setAttribute("class", "occupied whitePiece");
    }
  }
  
function findPieceCaptured(p, player) 
{
    let found = false;
    let column = p.column;
    let row = p.row;
    let countRow = board.length;
    let countCol = board[0].length;
    let pieceCaptured = null;

    if (((row - 1 >= 0 && column -1 >=0) && (row - 2 >= 0 && column - 2 >=0) ) &&
      board[row - 1][column - 1] === player &&
      board[row - 2][column - 2] === 0
    ) {
      found = true;
      newPosition = new Piece(p.row - 2, p.column - 2);
      // save the new position and the opponent's piece position
      pieceCaptured = new Piece(p.row - 1, p.column - 1);
    }
  
    if (((row - 1 >= 0 && column + 1 < countCol) && (row - 2 >= 0 && column  + 2 < countCol)) &&
      board[row - 1][column + 1] === player &&
      board[row - 2][column + 2] === 0
    ) {
      found = true;
      newPosition = new Piece(p.row - 2, p.column + 2);
      // save the new position and the opponent's piece position
      pieceCaptured = new Piece(p.row - 1, p.column + 1);
    }
  
    if (((row + 1 < countRow && column - 1 >= 0) && (row + 2 < countRow && column  - 2 >= 0)) &&
      board[row + 1][column - 1] === player &&
      board[row + 2][column - 2] === 0
    ) {
      found = true;
      newPosition = new Piece(p.row + 2, p.column - 2);
      // save the new position and the opponent's piece position
      pieceCaptured = new Piece(p.row + 1, p.column - 1);
    }
  
    if (((row + 1 < countRow && column + 1 < countCol) && (row + 2 < countRow && column  + 2 < countCol)) &&
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