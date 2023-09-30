// @ts-nocheck
const pl  = require('tau-prolog');
const session = pl.create();
require("tau-prolog/modules/promises.js")(pl);
require("tau-prolog/modules/lists.js")(pl);

const board2 = [
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0, 2, 0],
    [ 0, 0,  0, 0,  0, 0,  0, 0,  0, 3],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
];

// const board2 = [
//     [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
//     [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
//     [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
//     [0, 0, -1, 0, -1, 0, -1, 0, -1, 0],
//     [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
//     [0, 0, 0, 3, 0, 1, 0, 1, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
//     [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
// ];

function convertMatrixToList(matrix) 
{
    return `[${matrix.map(row => `[${row.join(', ')}]`).join(', ')}]`;
}

async function geNewtBoard() 
{
    let data = await queryProlog();
   // console.log('b :>> ', data[0].value);

    return convertPrologMatrixToMatrix(data[0].value.links.X,[],[]);
};

let queryProlog = async() => {

    const arr = [[1,3,4],[2,3,5],[2,3,4]];
    const matr = convertMatrixToList(arr);

    const goal = `double_matrix(${matr},X).`;

    await session.promiseConsult("./backend/code_prolog.pl");
    await session.promiseQuery(goal);

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


const AI = async(req,res) =>
{
    const
    {
        board
    } = req.body;
    
    let newBoard = await geNewtBoard();

    let oldPos = {row:-3,col:-3};
    let newPos = {row:-3,col:-3};
    for(let i=0;i<board2.length;i++)
    {
        for(let j=0;j<board2[0].length;j++)
        {
            if(board2[i][j] === 2)
            {
                oldPos.row = i;
                oldPos.col = j;
                break;
            }
            if(board2[i][j] === 3)
            {
                newPos.row = i;
                newPos.col = j;
                break;
            }
        }
        if(oldPos.row !== -3 && oldPos.col !==-3 && newPos.row !== -3 && newPos.col !== -3)
        {
            break;
        }
    }

    res.json({board:board2, oldPos:oldPos, newPos: newPos,captured: getCaptured(newPos)});   
}

function isNotEnd(row,col)
{
    return (row - 1 !== undefined && col - 1 !== undefined && row - 2 !== undefined && col - 2 !== undefined) ||
    (row + 1 !== undefined && col  + 1 !== undefined && row + 2 !== undefined && col + 2 !== undefined) ||
    (row - 1 !== undefined && col + 1 !== undefined && row - 2 !== undefined && col + 2 !== undefined) ||
    (row + 1 !== undefined && col - 1 !== undefined && row + 2 !== undefined && col - 2 !== undefined);
}
function getCaptured(newPos)
{
    if(isNotEnd(newPos.row,newPos.col)===false)
        return {row:undefined,col:undefined};
    if(board2[newPos.row - 1][newPos.col -1] === 1 && board2[newPos.row-2][newPos.col-2] === 2)
    {
        return {row:newPos.row-1,col:newPos.col-1};
    }
    if(board2[newPos.row - 1][newPos.col + 1] === 1 && board2[newPos.row-2][newPos.col+2] === 2)
    {
        return {row:newPos.row-1,col:newPos.col+1};
    }
    if(board2[newPos.row + 1][newPos.col + 1] === 1 && board2[newPos.row+2][newPos.col+2]===2)
    {
        return {row:newPos.row+1,col:newPos.col+1};
    }
    if(board2[newPos.row+1][newPos.col-1] === 1 && board2[newPos.row+2][newPos.col-2] === 2)
    {
        return {row:newPos.row+1,col:newPos.col-1};
    }
    return {row:undefined,col:undefined};
}

module.exports = AI;