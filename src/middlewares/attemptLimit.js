
const { error } = require('winston');
const blockedPhone = require('../models/blockedPhone');
const logger =require('../utils/logger');


const attemptLimit = async (req,res,next)=>{
    const {phone} = req.body;

    if(!phone) return res.status(400).json({ error:'Numero telefonico requerido'});
       
    const block = await blockedPhone.findOne({phone});

    if(block){
        const  unlocked_atStr = block. unlocked_at.toLocaleTimeString();
        let razon = 'bloqueo por actividad sospechosa';

        switch (req.method) {
            case 'POST':
                if(req.originalUrl.includes('/enviar-codigo')){
                    razon = 'envio excesivo de codigos';
                }else if(req.originalUrl.includes('/verificar')){
                    razon= 'verificacion fallida repetida';
                }else{
                    razon = 'Solicitudes POST excesivas';
                }
                
                break;
            case 'GET':
                razon= 'Acceso get bloqueado ';
                break;
            case 'PUT': 
             razon = 'modificaciones bloqueadas';
             break;
            case 'DELETE': 
            razon = 'funcion bloqueada';
            break;
        }

        logger.warn(`${phone} bloqueado al intentar ${req.method} -> ${req.originalUrl} | razon: ${razon}`);

        return res.status(429).json({
              error: `Demaciados intentosfallidos. Vuelve despues de ${ unlocked_atStr}`,
            motivo: razon, 
            // unlocked_at: block.unlocked_at.toLocaleTimeString()
        });
    }
        next()

    }

//         if(block){
//             logger.warn(`Bloqueado ${phone} hasta ${block.unlocked_at}`);
//             return res.status(429).json({
//                 error: `Demaciados intentosfallidos. Vuelve despues de ${block.unlocked_at.toLocaleTimeString()}`

//             });

//         }
//         next();


    
    
// }

module.exports= attemptLimit;