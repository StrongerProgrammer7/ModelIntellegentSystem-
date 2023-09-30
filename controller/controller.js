// @ts-nocheck
const Router = require('express');
const router = new Router();
const AI = require('../backend/AI');


router.post('/stepAI', AI);

module.exports = router;