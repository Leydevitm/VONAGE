
const { Router } = require('express');
const logger = require('../utils/logger');
const router = Router();

router.get('/prueba', (req, res) => {
    res.json({ msg: 'Servidor activo' });
});


router.get('/logger', (req,res)=>{
    logger.info('se recibio la peticion GET');
})

module.exports = router;
