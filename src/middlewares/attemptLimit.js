
const verificationCode = require('../models/verificationCode');

const logger =require('../utils/logger');

const blockedTime = 1*60*1000; 
const maxTries = 5; 

const attemptLimit = async (req,res,next)=>{
    const {phone} = req.body;

    if(!phone){
        return res.status(400).json({ error:'Numero telefonico requerido'})

    }
    try {
        const lastEntry = await verificationCode.findOne({phone})
        .sort({createdAt:-1});

        if(!lastEntry) return next();

        if(lastEntry.filedAttempts >= maxTries
         && Date.now() - lastEntry.createdAt.getTime() < blockedTime
        ){
            logger.warn(`Numero bloqueado temporalmente: ${phone}`);
            return res.status(429).json({
                error: 'Numero bloqueado por intentos fallido. Intenta de nuevomas tarde'
            });
        }
        next();
    } catch (error) {
        logger.error(`Error al verificar intentos de ${phone}: ${error.message}`);
        returnres.status(500).json({error:`Error interno del servidor`});
        
    }
}

module.exports= attemptLimit;