// @ts-nocheck
const pl  = require('tau-prolog');
const session = pl.create();
require("tau-prolog/modules/promises.js")(pl);
require("tau-prolog/modules/lists.js")(pl);
require("tau-prolog/modules/random.js")(pl);



function convertMatrixToList(matrix) 
{
    return `[${matrix.map(row => `[${row.join(', ')}]`).join(', ')}]`;
}

async function geNewtBoard(board) 
{
    let data = await queryProlog(board);
    //console.log('b :>> ', data[0].value);

    return convertPrologMatrixToMatrix(data[0].value.links.X,[],[]);
};

let queryProlog = async(board) => {

    try
    {
        const matr = convertMatrixToList(board);

        const goal = `main(${matr},X).`;
       
        console.log(goal);
        await session.promiseConsult("./backend/ch2.pl");
        await session.promiseQuery(goal);

        const data = await session.promiseAnswers(); 

        return [await data.next()];
    }catch(error)
    {
        console.log(error);
    }

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
       //console.log(jsArray);
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
    
    let newBoard = await geNewtBoard(board);
 
    let oldPos = {row:-3,col:-3};
    let newPos = {row:-3,col:-3};
    // for(let i=0;i<board2.length;i++)
    // {
    //     for(let j=0;j<board2[0].length;j++)
    //     {
    //         if(board2[i][j] === 2)
    //         {
    //             oldPos.row = i;
    //             oldPos.col = j;
    //             break;
    //         }
    //         if(board2[i][j] === 3 || board2[i][j] === 30)
    //         {
    //             if(board2[i][j] === 30)
    //                 board2[i][j] = -10;
    //             newPos.row = i;
    //             newPos.col = j;
    //             break;
    //         }
    //     }
    //     if(oldPos.row !== -3 && oldPos.col !==-3 && newPos.row !== -3 && newPos.col !== -3)
    //     {
    //         break;
    //     }
    // }
   // console.log(newBoard);
    res.json({board:newBoard});   
}

function isNotEnd(row,col)
{
    return (row - 1 !== undefined && col - 1 !== undefined && row - 2 !== undefined && col - 2 !== undefined) ||
    (row + 1 !== undefined && col  + 1 !== undefined && row + 2 !== undefined && col + 2 !== undefined) ||
    (row - 1 !== undefined && col + 1 !== undefined && row - 2 !== undefined && col + 2 !== undefined) ||
    (row + 1 !== undefined && col - 1 !== undefined && row + 2 !== undefined && col - 2 !== undefined);
}

function isPieceEnemy(row,col)
{
    return board2[row][col] === 1 || board2[row][col] === 10;  
}

function isEmptyPiece(row,col)
{
    return board2[row][col]===2;
}
function getCaptured(newPos)
{
    if(isNotEnd(newPos.row,newPos.col)===false)
        return {row:undefined,col:undefined};
    let captured = [];
    if(isPieceEnemy(row-1,col-1) && isEmptyPiece(row-2,col-2))
    {
        captured.push({row:newPos.row-1,col:newPos.col-1});
    }
    if(isPieceEnemy(row-1,col+1) && isEmptyPiece(row-2,col+2))
    {
        captured.push({row:newPos.row-1,col:newPos.col+1});
    }
    if(isPieceEnemy(row+1,col+1) && isEmptyPiece(row+2,col+2))
    {
        captured.push({row:newPos.row+1,col:newPos.col+1});
    }
    if(isPieceEnemy(row+1,col-1) && isEmptyPiece(row+2,col-2))
    {
        captured.push({row:newPos.row+1,col:newPos.col-1});
    }
    return captured;
}

module.exports = AI;