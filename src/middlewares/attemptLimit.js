
const { error } = require('winston');
const blockedPhone = require('../models/blockedPhone');
const logger =require('../utils/logger');


const attemptLimit = async (req,res,next)=>{
    const {phone} = req.body;

    if(!phone) return res.status(400).json({ error:'Numero telefonico requerido'});
       
    const block = await blockedPhone.findOne({phone});

        if(block){
            logger.warn(`Bloqueado ${phone} hasta ${block.unlocked_at}`);
            return res.status(429).json({
                error: `Demaciados intentosfallidos. Vuelve despues de ${block.unlocked_at.toLocaleTimeString()}`

            });

        }
        next();


    
    
}

module.exports= attemptLimit;