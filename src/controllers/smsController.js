const { startVerification, checkVerification } = require('../services/verifyService');

const startVerificationController = async (req, res) => {
    const sanitizedPhone = req.sanitizedPhone;


  try {
    const resultado = await startVerification(sanitizedPhone);
    return res.status(resultado.ok ? 200 : 400).json(resultado);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error interno al iniciar verificación',
      error: error.message
    });
  }
};

const checkVerificationController = async (req, res) => {
    const { sanitizedPhone } = req;
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Código obligatorio' });
    }

    try {
        const resultado = await checkVerification(sanitizedPhone, code);
        res.status(resultado.ok ? 200 : 400).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error interno al verificar código' });
    }
};

module.exports = {
    startVerificationController,
    checkVerificationController
};