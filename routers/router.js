// @ts-nocheck
const express = require('express');
const router = express.Router();
const fs = require('fs');


router.get('/',(req,res) =>
{
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    const page = fs.createReadStream('./public/index.html','utf8');
    page.pipe(res);
});

module.exports = router;