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

function moveEnemy()
  {
      try 
      {
        
        const data =
        {
          board:board
        };
        board = await fetch("/api/stepAI",
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers:
          {
            'Content-Type': 'application/json'
          }
        }).then(data => data.json())
        .then(async data =>
          {
            console.log(`End fetch`);
            return await data.board;
           
            // let oldPos = data.oldPos;
            // let newPos = data.newPos;
            // let captured = data.captured;
          });

      } catch (error) {
        console.log(error);
      }
  }