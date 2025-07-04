
const { Router } = require('express');
const logger = require('../utils/logger');
const sendCode = require('../services/codeServer');
const attemptLimit = require('../middlewares/attemptLimit');
const router = Router();

router.get('/prueba', (req, res) => {
    res.json({ msg: 'Servidor activo' });
});

router.post('/send-code', attemptLimit, async(req,res)=>{
    const {phone} = req.body;
    const resultado = await sendCode(phone);
    res.json(resultado);
})

router.get('/logger', (req,res)=>{
    logger.info('se recibio la peticion GET');
})

router.post('/verificar', attemptLimit,(req,res) =>{
    res.json({ok: true, mensaje: `Numero no bloqueado, puedes continuar`});
})

module.exports = router;
