// @ts-nocheck
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv').config();
const fs = require('fs');
const controller = require('./controller/controller');
const router = require('./routers/router');

const PORT = process.env.PORT  || 3000;

const app = express();

app.use(express.json());
app.use("/css",express.static(__dirname + "/public/css"));
app.use("/js",express.static(__dirname + "/public/js"));
app.use("/img",express.static(__dirname + "/public/img"));

app.use('/',router);
app.use('/api',controller);
const startServer = async function()
{
    try 
    {
        app.listen(PORT, () => console.log(`Server start on the port ${PORT}`));
    } catch (error) 
    {
        console.log(error);   
        console.error('Unable to connect to the server:', error); 
    }
}

startServer();