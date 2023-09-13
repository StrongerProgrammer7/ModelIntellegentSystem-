function movePiece(e)
{
    let piece = e.target;
    const row = parseInt(piece.getAttribue("row"));
    const column = parseInt(piece.getAttribue("column"));
    let p = new Piece(row,column);

    if(capturedPosition.length > 0)
        enableToCapture(p);
    else
        if(posNewPosition.length > 0)
            enableToMove(p);

    if(currentPlayer === board[row][column])
    {
        player = reverse(currentPlayer);
        if(!findPieceCaptured(p,player))
        {
            findPieceCaptured(p,player);
        }
    }
}