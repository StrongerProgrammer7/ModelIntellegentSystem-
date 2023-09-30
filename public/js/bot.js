// @ts-nocheck
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