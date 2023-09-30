increment_each([], []).
increment_each([X|Xs], [Y|Ys]) :-
    Y is X + 2,
    increment_each(Xs, Ys).


double_matrix([], []).
double_matrix([Row|RestOfMatrix], [DoubledRow|DoubledMatrix]) :-
    double_row(Row, DoubledRow),
    double_matrix(RestOfMatrix, DoubledMatrix).

% Define a predicate to double each element of a row.
double_row([], []).
double_row([X|Xs], [Y|Ys]) :-
    Y is X * 2,
    double_row(Xs, Ys).