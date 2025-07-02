const {Auth } = require('@vonage/auth')
const {SMS} = require('@vonage/sms')
const logger = require('../utils/logger')

const credenciales = new SMS({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,

});

const inicarVerificacion= async(phone,brand = 'Verificacion' )=>{
    return new Promise((resolve,reject)=>{
        credenciales.verify.start({ number:phone , brand}, (err,result)=>{
            if(err){
               

            }
        })

    })
} 

async function enviarCodigo(phone ){
    logger.info(`Intento de verificacion iniciado para ${phone}`);

    try {
        logger.info(`Codigo enviad exitosamente a ${phone}`);
    } catch (error) {
        logger.error(`Error al enviar codigo a ${phone}: ${error.message}`);
    }
}