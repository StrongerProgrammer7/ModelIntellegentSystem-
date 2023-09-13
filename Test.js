// @ts-nocheck
const  pl  = require('tau-prolog');

// Define the Prolog program
const prologProgram = `
    :- use_module(library(lists)).
    
    increment_by_2([], []).
    increment_by_2([H|T], [H2|T2]) :-
        H2 is H + 2,
        increment_by_2(T, T2).
`;

// Create a Tau Prolog engine
const session = pl.create();
require("tau-prolog/modules/promises.js")(pl);

let s = async() => {

  
    const arr = [1,2,3];
    const goal = `increment_each([${arr}],X).`;

    await session.promiseConsult("code_prolog.pl");
    await session.promiseQuery(goal);

    
    let a = [];
    //for await (let answer of session.promiseAnswers())
     //   a.push(session.format_answer(answer)); //  console.log(session.format_answer(answer));
    const data = await session.promiseAnswers(); 
    
    return data;
    //return a;

};

function convertPrologListToArray(prologList, jsArray) 
{

    if (prologList.indicator === './2') {

        //console.log('prologList :>> ', prologList.args);
        jsArray.push( prologList.args[0].value);

        console.log('jsArray :>> ', jsArray);
        convertPrologListToArray(prologList.args[1], jsArray);
    } else if (prologList.indicator === '[]/0') {
        return jsArray;
    } else {
        // Handle other cases as needed
        console.error('Unsupported Prolog list structure:', prologList);
    }
    return jsArray;
}

function fromList(xs) 
{
    var arr = [];
    while(pl.type.is_term(xs) && xs.indicator === "./2") {
        arr.push(xs.args[0]);
        xs = xs.args[1];
    }
    if(pl.type.is_term(xs) && xs.indicator === "[]/0")
        return arr;
    return null;
}

console.log('s :>> ', s);
let k = s().then(async data =>
    {
        console.log('data :>> ', data);
      //  console.log('data type :>> ',typeof data[0]);
        const resultArray = [];
        
        for await (const value of data) 
        {
            console.log('value :>> ', value.links.X.args);
 
            resultArray.push(value);
        }
        console.log('resultArray :>> ', resultArray);
        return resultArray;
    });
const b = [];
k.then(data =>
    { 
        const s = convertPrologListToArray(data[0].links.X,[]);
        console.log('s :>> ', s);
        b.push(...s);
    })
