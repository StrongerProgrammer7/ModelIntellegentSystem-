:- use_module(library(lists)). 
:- use_module(library(random)).


valid_piece(Board, X, Y, Piece) :-
    nth0(X, Board, Row),
    nth0(Y, Row, Piece),
    (Piece = 1 ;Piece = 10; Piece = -1;Piece = -10).
valid_piece_white(Board,X,Y):-
    nth0(X,Board,Row),
    nth0(Y,Row,Piece),
    (Piece=1;Piece = 10).

valid_piece_zero(Board,X,Y):-
    nth0(X,Board,Row),
    nth0(Y,Row,Piece),
    (Piece=0).
update_mat_rc(Mc,R,C,V,Mu) :-
    nth0(R,Mc,Rc,Mt),
    nth0(C,Rc,_,Rt),
    nth0(C,Ru,V,Rt),
    nth0(R,Mu,Ru,Mt).
	
% Predicate to delete duplicate rows from a matrix.
delete_duplicate_rows(Matrix, Result) :-
    delete_duplicate_rows(Matrix, [], Result).

% Base case: When the input matrix is empty, the result is also empty.
delete_duplicate_rows([], Result, Result).

% Recursive case: Process each row of the input matrix.
delete_duplicate_rows([Row | Rest], Accumulator, Result) :-
    % If the current row (Row) is not already in the Accumulator, add it.
    (member(Row, Accumulator) -> NewAccumulator = Accumulator ; append(Accumulator, [Row], NewAccumulator)),
    delete_duplicate_rows(Rest, NewAccumulator, Result).

% Predicate to find the index of the row with a specific difference.
find_row_index(Matrix, Index) :-
    find_row_index(Matrix, 0, Index).

% Base case: The matrix is empty, and the difference was not found, return -1.
find_row_index([], _, -1).


find_row_index([Row | Rest], CurrentIndex, Index) :-
    nth0(0, Row, FirstElement),
    nth0(2, Row, ThirdElement),
    Difference is abs(FirstElement - ThirdElement),
    (Difference =:= 2 -> Index = CurrentIndex ; NextIndex is CurrentIndex + 1, find_row_index(Rest, NextIndex, Index)).

recordNewRow([],[]).
recordNewRow([H|T],[H1|T1]):-
	H1 is H,
	recordNewRow(T,T1).


delete_empty_lists([], []).
delete_empty_lists([[] | Rest], Result) :- delete_empty_lists(Rest, Result).
delete_empty_lists([Head | Rest], [Head | Result]) :- 
    Head \= [], 
    delete_empty_lists(Rest, Result).
	
extract_values([X1, X2, X3, X4], X1, X2, X3, X4).
check_stepFromRow(Row,Board):-
	extract_values(Row,X,Y,X1,_),
	valid_piece(Board, X, Y,Piece),
	(Piece = -1, X < X1 ; Piece = -10). 
	
check_steps([],[],_).
check_steps([],[R1,T1],_):-
	R1 = [],
	check_steps([],T1,_).
check_steps([Row|T],[R1|T1],Board):-
	check_stepFromRow(Row,Board) -> recordNewRow(Row,R1), check_steps(T,T1,Board) 
	;
	check_steps(T,[R1|T1],Board).
	

% Make a random move for the AI according to the basic rules of checkers
make_random_move(Board, NewBoard) :-
    findall([X, Y, NewX, NewY],
            legal_move(Board, X, Y, NewX, NewY), MoveList),
    length(MoveList, NumMoves),
    NumMoves > 0,  
	delete_duplicate_rows(MoveList,Steps),
	find_row_index(Steps,Index), %Найти ход в котором можно бить
	(-1 is Index ->
		check_steps(Steps,NewSteps,Board),
		delete_empty_lists(NewSteps,ClearSteps),

		length(ClearSteps, NumSteps),
		(NumSteps = 0 ->
			NewBoard = []
			;
			random(0, NumSteps, Index2),
		
			nth0(Index2, ClearSteps, [X, Y, NewX, NewY]),!,
			apply_move(Board, X, Y, NewX, NewY, NewBoard),!
		
		)
		
		;
		nth0(Index, Steps, [X, Y, NewX, NewY]),!,
		apply_move(Board, X, Y, NewX, NewY, NewBoard),!
	).


% Define the rules for a legal move in checkers.
legal_move(Board, X, Y, NewX, NewY) :-
    valid_piece(Board, X, Y, Piece),  % Check if the piece at (X, Y) is owned by the AI.
	(Piece = -1;Piece = -10),
    valid_move(Board, X, Y, NewX, NewY).  % Check if the move is valid.



% Apply a move to the board.
apply_move(Board, X, Y, NewX, NewY, NewBoard) :-
    select_and_move(Board, X, Y, NewX, NewY, NewBoard).


% Define your own select_and_move logic for basic checkers.
select_and_move(Board, X, Y, NewX, NewY, NewBoard) :-
    % Check if the move is a capture.
    abs(NewX - X) =:= 2, abs(NewY - Y) =:= 2,
    CapturedX is (NewX + X) // 2,  % Calculate the X coordinate of the captured piece.
    CapturedY is (NewY + Y) // 2,  % Calculate the Y coordinate of the captured piece.

    % Check if a piece of the opponent is at the position to be captured.
    valid_piece_white(Board, CapturedX, CapturedY),
	valid_piece(Board, X, Y,Piece),
	valid_piece(Board, X, Y,Piece),
	update_mat_rc(Board, X, Y, 0, TempBoard),
	update_mat_rc(TempBoard, CapturedX, CapturedY, 0, TempBoard2),
	(NewX = 9,Piece = -1 -> 
		update_mat_rc(TempBoard2, NewX, NewY, -10, NewBoard)
	;
		update_mat_rc(TempBoard2, NewX, NewY, Piece, NewBoard)
	).

% If it's not a capture, it's a regular move.
select_and_move(Board, X, Y, NewX, NewY, NewBoard) :-
    % Check if the move is a regular one square diagonal move.
    abs(NewX - X) =:= 1, abs(NewY - Y) =:= 1,

    % Ensure the destination square is empty.
    valid_piece_zero(Board, NewX, NewY),
	valid_piece(Board, X, Y,Piece),
	update_mat_rc(Board, X, Y, 0, TempBoard),
	(NewX = 9,Piece = -1 -> 
		update_mat_rc(TempBoard, NewX, NewY, -10, NewBoard)
	;
		update_mat_rc(TempBoard, NewX, NewY, Piece, NewBoard)
	).



% Define your own valid_move predicate for checkers.
valid_move(Board, X, Y, NewX, NewY) :-
	
   % Ensure that the destination is within the board boundaries.
    between(0, 9, NewX),
    between(0, 9, NewY),

    % Make sure the source and destination are different.
    (X \= NewX ; Y \= NewY),
	
	
    % Calculate the horizontal and vertical movement.
    DeltaX is abs(NewX - X),
    DeltaY is abs(NewY - Y),

    % Ensure that the move is diagonal (DeltaX == DeltaY).
    DeltaX =:= DeltaY,

    % Check if the destination square is unoccupied.
    valid_piece_zero(Board,NewX,NewY),
    % Get the piece at the starting position.
    valid_piece(Board, X, Y,Piece),
    (Piece = -1;Piece = -10),
    MaybeX is NewX - 1,
    MaybeXUp is NewX + 1,
	MaybCaX is NewX - 2,
	MaybCaXUp is NewX + 2,
    ((DeltaX = 1,(MaybeX = X;MaybeXUp = X)); (DeltaX = 2,(MaybCaX = X;MaybCaXUp = X))),

    % Check for regular moves (one square diagonal).
    (DeltaX =:= 1 -> true ;  % Regular move
    % Check for captures (two squares diagonal with an opponent's piece in between).
    DeltaX =:= 2 ->
        CapturedX is (X + NewX) // 2,  % Calculate the X coordinate of the captured piece
        CapturedY is (Y + NewY) // 2,  % Calculate the Y coordinate of the captured piece
        valid_piece(Board, CapturedX, CapturedY, OpponentPiece),
        (OpponentPiece = 1;OpponentPiece=10)
    ).



main(Board,X) :-
    make_random_move(Board, X),!.



