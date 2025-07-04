

const {Vonage} = require('@vonage/server-sdk');
const logger = require('../utils/logger');

const vonage= new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
});

/**
 * Envía un mensaje SMS usando Vonage
 * @param {string} phone 
 * @param {string} mensaje 
 */

const sendSMS = async (phone, mensaje) => {
  return new Promise((resolve, reject) => {
    vonage.sms.send({ to: phone, from: 'vonage', text: mensaje }, (err, response) => {
      if (err) {
        logger.error(`Vonage error al enviar a ${phone}: ${err.message}`);
        return reject(err);
      }

      const { messages } = response;
      const estado = messages[0].status;

      if (estado === '0') {
        logger.info(` SMS enviado a ${phone} | ID: ${messages[0]['message-id']}`);
        resolve(true);
      } else {
        logger.warn(` Vonage falló para ${phone}: Código ${estado} - ${messages[0]['error-text']}`);
        resolve(false); 
      }
    });
  });
};
module.exports=sendSMS;