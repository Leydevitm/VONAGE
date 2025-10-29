const express = require ( 'express');
const  basicAuth  = require  ('../middlewares/basicAuth.js');
const  generateToken  = require  ( '../controllers/tokenController.js');

const router = express.Router();

router.get('/get-public-token', basicAuth, generateToken);

module.exports = router;