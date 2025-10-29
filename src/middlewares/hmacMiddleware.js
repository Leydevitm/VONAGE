const generateSign = require('../services/hmacService');
const crypto = require('crypto');

const hmacMiddleware = (req, res, next) => {
  try {
    const signature = req.headers['x-signature'];
    
    if (!signature) {
      return res.status(401).json({ error: 'Firma HMAC requerida' });
    }

    // Generar firma esperada
    const expectedSign = generateSign(req.body);
    
    // Comparar firmas de manera segura
    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSign, 'hex');
    
    if (signatureBuffer.length !== expectedBuffer.length || 
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return res.status(401).json({ error: 'Firma HMAC inválida' });
    }

    console.log('Firma HMAC válida');
    next();

  } catch (error) {
    console.error(' Error en HMAC middleware:', error);
    return res.status(500).json({ error: 'Error validando firma' });
  }
};

module.exports = hmacMiddleware;