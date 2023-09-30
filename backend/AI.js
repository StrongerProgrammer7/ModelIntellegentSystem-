// @ts-nocheck
const pl  = require('tau-prolog');
// Create a Tau Prolog engine
const session = pl.create();
require("tau-prolog/modules/promises.js")(pl);
require("tau-prolog/modules/lists.js")(pl);



const AI = async(req,res) =>
{
    const
    {
        board
    } = req.body;
    
    let data = await queryProlog();
   
    const b = data.then((data) =>
    { 
        const board_new = convertPrologMatrixToMatrix(data[0].value.links.X,[],[]);
        console.log('board_new :>> ', board_new);
        res.json(board_new);
    });
    res.json(board);
}

function convertMatrixToList(matrix) 
{
    return `[${matrix.map(row => `[${row.join(', ')}]`).join(', ')}]`;
}

let queryProlog = async() => {

  
    const arr = [[1],[2,3]];
    const matr = convertMatrixToList(arr);
   
    const goal = `double_matrix(${matr},X).`;

    await session.promiseConsult("./backend/code_prolog.pl");
    await session.promiseQuery(goal);
   
   // let a = [];
   // for await (let answer of session.promiseAnswers())
    //    a.push(session.format_answer(answer)); //  console.log(session.format_answer(answer));
    const data = await session.promiseAnswers();   
   return [await data.next()];

};

function convertPrologMatrixToMatrix(prologList, jsArray,array) 
{
   
    if (prologList.indicator === './2') 
    {
        let num = null;
        if(prologList.args[0].args)
            num = prologList.args[0].args[0].value;
        else
            num = prologList.args[0].value;
       // console.log('prologList :>> ', prologList.args[0].args[0].value);
        //console.log('prologList :>> ', prologList.args[0].args);
       // console.log('prologList :>> ', prologList.args[0].args[1]);

        array.push(num);
        if(prologList.args[0].args)
        {
            jsArray = convertPrologMatrixToMatrix(prologList.args[0].args[1],jsArray,array);
            jsArray = convertPrologMatrixToMatrix(prologList.args[1], jsArray,[]);
        }else
            jsArray = convertPrologMatrixToMatrix(prologList.args[1], jsArray,array);
       
       // jsArray = convertPrologMatrixToMatrix(prologList.args[1], jsArray,[]);
    } else if (prologList.indicator === '[]/0' && array.length > 0) 
    {
        jsArray.push(array);
        //console.log('jsArray :>> ', jsArray);
        return jsArray;
    }
    return jsArray;
}

module.exports = AI;