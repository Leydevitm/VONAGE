
const { Vonage } = require('@vonage/server-sdk');
const logger = require('../utils/logger');

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
});


const sendSMS = async (to, text) => {
    try {
        const from = process.env.VONAGE_SENDER_ID || 'Vonage';
        const response = await vonage.sms.send({ to, from, text });
        
        const { messages } = response;
        const message = messages[0];

        if (message.status === '0') {
            logger.info(`SMS enviado a ${to} | ID: ${message['message-id']}`);
            return {
                sent: true,
                'message-id': message['message-id'],
                status: message.status
            };
        } else {
            logger.warn(`Error enviando SMS a ${to}: ${message['error-text']}`);
            return {
                sent: false,
                error: message['error-text'],
                status: message.status
            };
        }
    } catch (error) {
        logger.error(`Error Vonage SMS para ${to}: ${error.message}`);
        return {
            sent: false,
            error: error.message
        };
    }
};

const sendVerificationCode = async (phone, brand = "Super Kompras") => {
    try {
        const result = await vonage.verify.start({
            number: phone,
            brand: brand,
            code_length: 6
        });
        
        logger.info(`Verify request sent to ${phone}, request_id: ${result.request_id}`);
        
        return {
            sent: true,
            request_id: result.request_id,
            status: result.status
        };
    } catch (error) {
        logger.error(`Vonage Verify error for ${phone}: ${error.message}`);
        return {
            sent: false,
            error: error.message,
            'status-message': error.message
        };
    }
};

const checkVerificationCode = async (request_id, code) => {
    try {
        const result = await vonage.verify.check(request_id, code);
        
        return {
            verified: true,
            status: result.status,
            event_id: result.event_id
        };
    } catch (error) {
        logger.error(`Vonage Verify check error: ${error.message}`);
        return {
            verified: false,
            error: error.message,
            status: error.status || 'error'
        };
    }
};

module.exports = {
    sendSMS,
    sendVerificationCode,
    checkVerificationCode
};