
const logger = require('../utils/logger');

const enviarSMS = async(req,resp)=>{
    const {phone} = req.body; 
    logger.info(`Solicitud de envio de SMS  recibida para ${phone}`)
}