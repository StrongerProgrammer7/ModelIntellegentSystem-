is_unbound(X) :-
    var(X).
	
get_row([],[]).
get_row([H|T],[H2|T2]):-
	H2 is H,
	get_row(T,T2).

replace_elemRow([],_,_,_,[]).
replace_elemRow([H|T],Y,Iy,V,[H2|T2]):-
	(Iy = Y ->
		H2 is V
	;
		H2 is H
	),
	NewIy is Iy + 1,
	replace_elemRow(T,Y,NewIy,V,T2).

	
valid_piece_zero_get_row([],_,_,_).
valid_piece_zero_get_row([H|T],X,Ix,Row):-
	(Ix = X ->
		get_row(H,Row)
		;
		Ix1 is Ix + 1,
		valid_piece_zero_get_row(T,X,Ix1,Row)
	).
valid_piece_zero_get_piece([],_,_,_).
valid_piece_zero_get_piece([H|T],Y,Iy,P):-
	(Iy = Y ->
		P is H
		;
		NIy is Iy + 1,
		valid_piece_zero_get_piece(T,Y,NIy,P)
	).
get_row_by_x([],_,_,_).
get_row_by_x([H|T],X,Ix,Row):-
	(Ix = X ->
		get_row(H,Row)
		;
		NewIx is Ix + 1,
		get_row_by_x(T,X,NewIx,Row)
	).
	
valid_piece(Board, X, Y, Piece) :-
    %nth0(X, Board, Row),
	get_matrix_element_at1(X,Y,Board,Piece),
    %nth0(Y, Row, Piece),
    (Piece = 1 ; Piece = -1).

% Предикат для извлечения элемента из списка по указанному индексу
get_element_at(Index, List, Element) :-
    get_element_at(Index, List, Element, 0).

% Рекурсивный предикат для извлечения элемента по индексу
get_element_at(Index, [Element|_], Element, Index) :-
    Index = 0.

get_element_at(Index, [_|Rest], Element, CurrentIndex) :-
    Index > 0,
    NewIndex is Index - 1,
    get_element_at(NewIndex, Rest, Element, CurrentIndex).
	
	
%-------------------------------------------
valid_piece_calc([],_,_,_).
valid_piece_calc([H|T],X,Y,Piece):-
	NewX is X + 1,
	valid_piece_calc_y(H,Y,Piece),
	(Piece \= 1 , Piece \= -1), 
	valid_piece_calc(T,NewX,0,Piece).
	
valid_piece_calc_y([],_,_).
valid_piece_calc_y([],Y,P).
valid_piece_calc_y([H|T],Y,P):-
	var(Y) ->
		Y is -1,
		P is H,
		(P = 1 , P = -1) -> valid_piece_calc_y(_,Y,P);
		NewY is Y + 1,
		valid_piece_calc_y(T,NewY,H)
	;
	(P = 1 , P = -1) -> valid_piece_calc_y(_,Y,P);
	NewY is Y + 1,
	valid_piece_calc_y(T,NewY,H).
	
%----------------------------------------------

valid_piece_white(Board,X,Y):-
    %nth0(X,Board,Row),
	valid_piece_zero_get_row(Board,X,0,Row),
    %nth0(Y,Row,Piece),
	valid_piece_zero_get_piece(Row,Y,0,Piece),
    (Piece=1).

valid_piece_zero(Board,X,Y):-
    %nth0(X,Board,Row),
	valid_piece_zero_get_row(Board,X,0,Row),
    %nth0(Y,Row,Piece),
	valid_piece_zero_get_piece(Row,Y,0,Piece),
    (Piece=0).
	
%update_mat_rc(Mc,R,C,V,Mu) :-
    %nth0(R,Mc,Rc,Mt),
    %nth0(C,Rc,_,Rt),
    %nth0(C,Ru,V,Rt),
    %nth0(R,Mu,Ru,Mt).
	


%-------------------------------------
% Предикат для извлечения элемента из матрицы по указанным индексам и возврата индексов (X и Y)
get_matrix_element_at1(X, Y, Matrix, Element) :-
    get_row_at1(X, Matrix, Row),
    get_element_at1(Y, Row, Element).
    %(Element = 1 ; Element = -1).

get_matrix_element_at1(X, Y, Matrix, Element) :-
    (X1 is X + 1 ; X1 is 0), % Увеличиваем X и сбрасываем Y
    Y1 is Y + 1, % Увеличиваем Y
    get_matrix_element_at1(X1, Y1, Matrix, Element).

% Рекурсивный предикат для извлечения строки матрицы по индексу X
get_row_at1(0, [Row|_], Row).
get_row_at1(X, [_|Rest], Row) :-
	var(X),X is 1,
    X > 0,
    X1 is X - 1,
    get_row_at1(X1, Rest, Row);
	 X > 0,
    X1 is X - 1,
    get_row_at1(X1, Rest, Row).

% Рекурсивный предикат для извлечения элемента из списка по индексу
get_element_at1(0, [Element|_], Element).
get_element_at1(Y, [_|Rest], Element) :-
	var(Y), Y is 1,
    Y > 0,
    Y1 is Y - 1,
    get_element_at1(Y1, Rest, Element);
	 Y > 0,
    Y1 is Y - 1,
    get_element_at1(Y1, Rest, Element)
	.
%---------------------------------------------------		
	
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

% Recursive case: Process each row in the matrix.
find_row_index([Row | Rest], CurrentIndex, Index) :-
    nth0(0, Row, FirstElement),
    nth0(2, Row, ThirdElement),
    Difference is abs(FirstElement - ThirdElement),
    (Difference =:= 2 -> Index = CurrentIndex ; NextIndex is CurrentIndex + 1, find_row_index(Rest, NextIndex, Index)).


% Make a random move for the AI according to the basic rules of checkers
make_random_move(Board, NewBoard) :-
    findall([X, Y, NewX, NewY],
            legal_move(Board, X, Y, NewX, NewY), MoveList),
    length(MoveList, NumMoves),
    NumMoves > 0,  % Ensure there are legal moves available.
	delete_duplicate_rows(MoveList,Steps),
	find_row_index(Steps,Index),
	(-1 is Index ->
		% Randomly select a move from the list of legal moves.
		length(Steps, NumSteps),
		random(0, NumSteps, Index2),

		nth0(Index2, Steps, [X, Y, NewX, NewY]),!
		;
		nth0(Index, Steps, [X, Y, NewX, NewY]),!
	),

    %nth0(Index, Steps, [X, Y, NewX, NewY]),

    % Apply the selected move to the board.
    apply_move(Board, X, Y, NewX, NewY, NewBoard),!.

% Define the rules for a legal move in checkers.
legal_move(Board, X, Y, NewX, NewY) :-
    valid_piece(Board, X, Y, Piece),  % Check if the piece at (X, Y) is owned by the AI.
	Piece = -1,
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
    % Update the board after capturing the opponent's piece.
    update_mat_rc(Board, X, Y, 0, TempBoard),
    update_mat_rc(TempBoard, CapturedX, CapturedY, 0, TempBoard2),
    update_mat_rc(TempBoard2, NewX, NewY, -1, NewBoard).

% If it's not a capture, it's a regular move.
select_and_move(Board, X, Y, NewX, NewY, NewBoard) :-
    % Check if the move is a regular one square diagonal move.
    abs(NewX - X) =:= 1, abs(NewY - Y) =:= 1,

    % Ensure the destination square is empty.
    valid_piece_zero(Board, NewX, NewY),

    % Update the board for the regular move.
    update_mat_rc(Board, X, Y, 0, TempBoard),
    update_mat_rc(TempBoard, NewX, NewY, -1, NewBoard).



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
    Piece = -1,
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
        OpponentPiece = 1
    ).



main(Board,X) :-
    make_random_move(Board, X).