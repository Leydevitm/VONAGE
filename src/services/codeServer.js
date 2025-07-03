
const bcrypt = require('bcrypt');
const VerificationCode = require('../models/verificationCode');
const codeGenerator = require ('../utils/codeGenerator');
const logger = require('../utils/logger');


const sendCode = async ( phone, provider= 'Vonage' )=>{
    try {
        const codigo = codeGenerator();
        const hash = await bcrypt.hash(codigo,10);
        const expiracion = new Date(Date.now() + 5 *60000);
        const registro = await VerificationCode.create({
            phone,
            code: hash,
            provider,
            expiresAt: expiracion

        });
        logger.info(`Codigo generado y almacenado para ${phone} | ID: ${registro._id} | proveedor: ${provider} | Expira: ${expiracion} `)
        return {exito: true,codigo,registroId: registro._id};
    } catch (error) {
        logger.error(`Error al generar y guardar codigo para ${phone}: ${error.message}`);
        return {exito:false, error:error.message};
        
    }
};

module.exports=sendCode