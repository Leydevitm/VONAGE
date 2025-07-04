
const { Router } = require('express');
const logger = require('../utils/logger');
const sendCode = require('../services/codeServer');
const verifyService = require('../services/verifyService')
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

router.post('/verificar', attemptLimit,async (req,res) =>{
    const {phone, code} = req.body;

    if(!phone || !code){
        return res.status(400).json({error: 'Numero y codigo obligatorios'})
    }

    try {
        const resultado = await verifyService(phone, code);
        res.status(resultado.ok ? 200 :400).json(resultado);

    } catch (error) {
        // const.error('Error en verificar', error);
        res.status(500).json({error:'Error interno del servidor'})

    }
    
})

module.exports = router;
