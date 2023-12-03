
main(Board,[]) :-
    make_random_move(Board, NewBoard).

% Make a random move for the AI according to the basic rules of checkers
make_random_move(Board, NewBoard) :-
    findall([X, Y, NewX, NewY],
            legal_move(Board, X, Y, NewX, NewY), MoveList),
    length(MoveList, NumMoves),
    NumMoves > 0,  % Ensure there are legal moves available.

    % Randomly select a move from the list of legal moves.
    random(0, NumMoves, Index),
    nth0(Index, MoveList, [X, Y, NewX, NewY]),

    % Apply the selected move to the board.
    apply_move(Board, X, Y, NewX, NewY, NewBoard).

% Define the rules for a legal move in checkers.
legal_move(Board, X, Y, NewX, NewY) :-
    valid_piece(Board, X, Y, -1),  % Check if the piece at (X, Y) is owned by the AI.
    valid_move(Board, X, Y, NewX, NewY).  % Check if the move is valid.


% Apply a move to the board.
apply_move(Board, X, Y, NewX, NewY, NewBoard) :-
    select_and_move(Board, X, Y, NewX, NewY, NewBoard).

% Define your own select_and_move logic for checkers here.
% Define your own select_and_move logic for basic checkers.
select_and_move(Board, X, Y, NewX, NewY, NewBoard) :-
    % Check if the move is a capture.
    abs(NewX - X) =:= 2, abs(NewY - Y) =:= 2,
    CapturedX is (NewX + X) // 2,  % Calculate the X coordinate of the captured piece.
    CapturedY is (NewY + Y) // 2,  % Calculate the Y coordinate of the captured piece.

    % Check if a piece of the opponent is at the position to be captured.
    valid_piece(Board, CapturedX, CapturedY, -1),

    % Update the board after capturing the opponent's piece.
    replace(Board, X, Y, 0, TempBoard),
    replace(TempBoard, CapturedX, CapturedY, 0, TempBoard2),
    replace(TempBoard2, NewX, NewY, 1, NewBoard).

% If it's not a capture, it's a regular move.
select_and_move(Board, X, Y, NewX, NewY, NewBoard) :-
    % Check if the move is a regular one square diagonal move.
    abs(NewX - X) =:= 1, abs(NewY - Y) =:= 1,

    % Ensure the destination square is empty.
    valid_piece(Board, NewX, NewY, 0),

    % Update the board for the regular move.
    replace(Board, X, Y, 0, TempBoard),
    replace(TempBoard, NewX, NewY, 1, NewBoard).

% Define a predicate to replace an element at a specified position in a list.
replace([_|T], 0, X, [X|T]).
replace([H|T], I, X, [H|R]) :-
    I > 0,
    I1 is I - 1,
    replace(T, I1, X, R).

% Define your own valid_piece predicate for checking the piece at a specific location.
% This predicate should return true for the player's pieces (1 or -1) and false for empty squares (0).

	
valid_piece(Board, X, Y, Piece) :-
    nth0(X, Board, Row),
    nth0(Y, Row, Piece),
    (Piece = 1 ; Piece = -1).
valid_piece_zero(Board,X,Y,Piece):-
    nth0(X,Board,Row),
    nth0(Y,Row,Piece),
    (Piece=0).

% Define your own valid_move predicate for checkers.
valid_move(Board, X, Y, NewX, NewY) :-
   % Ensure that the destination is within the board boundaries.
    between(0, 7, NewX),
    between(0, 7, NewY),

    % Make sure the source and destination are different.
    (X \= NewX ; Y \= NewY),

    % Calculate the horizontal and vertical movement.
    DeltaX is abs(NewX - X),
    DeltaY is abs(NewY - Y),

    % Ensure that the move is diagonal (DeltaX == DeltaY).
    DeltaX =:= DeltaY,

    % Check if the destination square is unoccupied.
    %valid_piece(Board, NewX, NewY, 0),
    valid_piece_zero(Board,NewX,NewY,0),
    % Get the piece at the starting position.
    valid_piece(Board, X, Y, -1),
    %valid_piece(Board, X, Y, Piece),
    %Check if the piece is owned by the current player.
    %(Piece = 1 ; Piece = -1),

    % Check for regular moves (one square diagonal).
    (DeltaX =:= 1 -> true ;  % Regular move
    % Check for captures (two squares diagonal with an opponent's piece in between).
    DeltaX =:= 2 ->
        CapturedX is (X + NewX) // 2,  % Calculate the X coordinate of the captured piece.
        CapturedY is (Y + NewY) // 2,  % Calculate the Y coordinate of the captured piece.
        valid_piece(Board, CapturedX, CapturedY, OpponentPiece),
        (Piece = 1, OpponentPiece = -1 ; Piece = -1, OpponentPiece = 1)  % Opponent's piece is in between.
    ).
