// @ts-nocheck
const pl  = require('tau-prolog');
const session = pl.create();
require("tau-prolog/modules/promises.js")(pl);
require("tau-prolog/modules/lists.js")(pl);
require("tau-prolog/modules/random.js")(pl);

const START_PROLOG = 'main';

function convertMatrixToList(matrix) 
{
    return `[${matrix.map(row => `[${row.join(', ')}]`).join(', ')}]`;
}

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
            jsArray = convertPrologMatrixToMatrix(prologList.args[0].args[1],jsArray,array); //Continue [_,4,5]
            jsArray = convertPrologMatrixToMatrix(prologList.args[1], jsArray,[]); //Continue new line
        }else
            jsArray = convertPrologMatrixToMatrix(prologList.args[1], jsArray,array);
       //console.log(jsArray);
       //jsArray = convertPrologMatrixToMatrix(prologList.args[1], jsArray,[]);
    } else if (prologList.indicator === '[]/0' && array.length > 0) 
    {
        jsArray.push(array);
        return jsArray;
    }
    return jsArray;
}


let queryProlog = async(board) => {

    try
    {
        const matrixForProlog = convertMatrixToList(board);

        const goal = `${START_PROLOG}(${matrixForProlog},X).`;
       
        await session.promiseConsult("./backend/ch2.pl");
        await session.promiseQuery(goal);

        const data = await session.promiseAnswers(); 

        return [await data.next()];
    }catch(error)
    {
        console.log(error);
    }

};

async function geNewtBoard(board) 
{
    let data = await queryProlog(board);

    return convertPrologMatrixToMatrix(data[0].value.links.X,[],[]);
};


const AI = async(req,res) =>
{
    const
    {
        board
    } = req.body;
    
    let newBoard = await geNewtBoard(board);
 

    if(newBoard.length ===0)
        return res.json({board:board,message:"Loss"});
    
    return res.json({board:newBoard});   
}


module.exports = AI;