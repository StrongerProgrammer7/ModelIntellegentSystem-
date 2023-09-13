increment_each([], []).
increment_each([X|Xs], [Y|Ys]) :-
    Y is X + 2,
    increment_each(Xs, Ys).
