// @ts-nocheck
function movePieceAI(oldPos,newPos,captured) // this start for AI
{
    let king = board[newPos.row][newPos.col] === -10;
    let p = new Piece(oldPos.row, oldPos.column,king);

    if(captured.row!==undefined )
    {
      //EAT enemy
      enableToCaptureAI(newPos,oldPos,captured,king);
    }else
    {
      //Simple move
      moveThePieceAI(newPos,oldPos,king);
    }
  
}


  function enableToCaptureAI(newPos,oldPos,captured,king) 
  {
  
      board[newPos.row][newPos.col] = king === false ? currentPlayer : -10; 
      board[oldPos.row][oldPos.col] = 0;
      board[captured.row][captured.col] = 0; 
 
  
      readyToMove = null;
      capturedPosition = [];
      posNewPosition = [];
      rePaint();
      currentPlayer = reverse(currentPlayer);
  }
  

function moveThePieceAI(newPosition,oldPost) 
{
  // if the current piece can move on, edit the board and rebuild
  board[newPosition.row][newPosition.col] = king === false ? currentPlayer : -10;
  board[oldPost.row][oldPost.col] = 0;

  // init value
  readyToMove = null;
  posNewPosition = [];
  capturedPosition = [];

  currentPlayer = reverse(currentPlayer);

  rePaint();

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