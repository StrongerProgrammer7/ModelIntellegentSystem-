:- use_module(library(lists)). 
:- use_module(library(random)).

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

% nth0_row/3 retrieves the row at index X in the matrix.
nth0_row(X, [Row|_], Row) :-
    X = 0. % Base case: X is 0, return the first row.

nth0_row(X, [_|Rest], Row) :-
    X < 10, % If X is greater than 0, decrement it and continue.
    X1 is X + 1,
    nth0_row(X1, Rest, Row).

custom_nth0Row(_,[],_).
custom_nth0Row(0,[El|_],El).
custom_nth0Row(Y,[El|T],El):-
	(var(Y) -> Y1 = 0; Y1 is Y + 1),
	custom_nth0Row(Y1,T,El).
	
custom_nth0Row(Y,Row,El):-
	el_index_in_row(El,Row,Y).
	
%-----------------------------------
el_index_in_row(El, Row, Index) :-
    el_index_in_row(El, Row, 0, Index).

el_index_in_row(El, [El|_], Index, Index).
el_index_in_row(El, [_|T], Index, Result) :-
    NextIndex is Index + 1,
    el_index_in_row(El, T, NextIndex, Result).


%---------------------------------

	
custom_nth0(_, [], _).
custom_nth0(0, [Row|_], Row).

custom_nth0(X, [Row|Rest], Row) :-
    (var(X) -> X1 = 0 ; X1 is X + 1),
    custom_nth0(X1, Rest, Row).
custom_nth0(X, Board, Row):-
	row_index_in_matrix(Row,Board,X).
%----------------------------------
row_index_in_matrix(Row, Matrix, Index) :-
    row_index_in_matrix(Row, Matrix, 0, Index).

% row_index_in_matrix/4 вспомогательный предикат для определения индекса ряда
row_index_in_matrix(Row, [Row|_], Index, Index).
row_index_in_matrix(Row, [_|Rest], Index, Result) :-
    NextIndex is Index + 1,
    row_index_in_matrix(Row, Rest, NextIndex, Result).
%-----------------------------------------

%custom_nth0(X, Matrix, Row) :-
    %(var(X) -> X = 0 ; true), 
    %nth0_row(X, Matrix, Row).

get_row_by_index(0, [Row|_], Row).
get_row_by_index(X, [_|Rest], Row) :-
    X > 0,
    X1 is X - 1,
    get_row_by_index(X1, Rest, Row).

valid_piece_byXYBoard(Board,X,Y,Piece):-
    get_row_by_index(X,Board,Row),
    get_element_at(Y,Row,Piece),%nth0(Y, Row, Piece),
    (Piece = 1 ; Piece = -1).
	
extract_values([X1, X2, X3, X4], X1, X2, X3, X4).
%--------------------------------------------------------

valid_piece(Board, X, Y, Piece) :-
    custom_nth0(X,Board,Row),
    (var(Row) -> X1 is X + 1, custom_nth0(X1, Board, Row) ; true),%nth0(X, Board, Row),
    custom_nth0Row(Y,Row,Piece),%nth0(Y, Row, Piece),
	(var(Piece) -> Y1 is Y + 1,  custom_nth0Row(Y1,Row,Piece);true),
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

update_mat_rc(Matrix, X, Y, V, M) :-
    update_matrix_element(Matrix, X, Y, V,0, M),!.

update_matrix_element([], _, _, _,_,[]).
update_matrix_element([Row|RestRows], X, Y, V,Ix, [NewRow|RestNewRows]) :-
	(Ix = X ->
		replace_elemRow(Row,Y,0,V,NewRow)
	;
		get_row(Row,NewRow)
	),
	NewXI is Ix + 1,
    update_matrix_element(RestRows,X,Y,V,NewXI,RestNewRows).


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
    %nth0(0, Row, FirstElement),
	get_element_at(0,Row,FirstElement),
	get_element_at(2,Row,ThirdElement),
    %nth0(2, Row, ThirdElement),
    Difference is abs(FirstElement - ThirdElement),
    (Difference =:= 2 -> Index = CurrentIndex ; NextIndex is CurrentIndex + 1, find_row_index(Rest, NextIndex, Index)).

getLength([],Count,Count).
getLength([_|T],Ind,Count):-
	Ind1 is Ind + 1,
	getLength(T,Ind1,Count).
	
getLength(Matr,Count):-
	getLength(Matr,0,Count).

% Make a random move for the AI according to the basic rules of checkers
make_random_move(Board, NewBoard) :-
    findall([X, Y, NewX, NewY],
            legal_move(Board, X, Y, NewX, NewY), MoveList),
    getLength(MoveList, NumMoves),
    NumMoves > 0,  % Ensure there are legal moves available.
	delete_duplicate_rows(MoveList,Steps),
	find_row_index(Steps,Index),
	(-1 is Index ->
		% Randomly select a move from the list of legal moves.
		getLength(Steps, NumSteps),
		random(0, NumSteps, Index2),

		%nth0(Index2, Steps, [X, Y, NewX, NewY]),!
		get_row_by_index(Index2,Steps,Row),
		extract_values(Row,X,Y,NewX,NewY),!
		;
		%nth0(Index, Steps, [X, Y, NewX, NewY]),!
		get_row_by_index(Index,Steps,Row),
		extract_values(Row,X,Y,NewX,NewY),!
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
    valid_piece_byXYBoard(Board,X,Y,Piece),%valid_piece(Board, X, Y,Piece),
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
        %valid_piece(Board, CapturedX, CapturedY, OpponentPiece),
		valid_piece_byXYBoard(Board, CapturedX, CapturedY, OpponentPiece),
        OpponentPiece = 1
    ).



main(Board,X) :-
    make_random_move(Board, X).




