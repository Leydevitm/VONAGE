const express = require ( 'express');
const  generateHmacSign  = require ( '../controllers/hmacController.js');
const basicAuth  = require ( '../middlewares/basicAuth.js');

const router = express.Router();

router.post('/generate-sign', basicAuth, generateHmacSign);

module.exports = router;