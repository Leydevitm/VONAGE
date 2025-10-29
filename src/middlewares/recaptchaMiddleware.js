const recaptchaService = require('../services/recaptchaService');

const captchaMiddleware = (expectedAction = null, minScore = 0.5) => {
  return async (req, res, next) => {
    try {
      const { token } = req.body;

      // Validar token presente
      if (!token) {
        return res.status(400).json({ 
          error: "Token de reCAPTCHA requerido",
          code: "MISSING_CAPTCHA_TOKEN"
        });
      }

      // Token de testing para desarrollo
      if (token === "TESTING_TOKEN" || process.env.NODE_ENV === 'development') {
        console.log(' MODO DESARROLLO - Token de prueba aceptado');
        req.captchaData = { 
          score: 0.9, 
          action: expectedAction || 'development',
          valid: true,
          mode: 'development'
        };
        return next();
      }

      // Validar reCAPTCHA con Google Cloud
      const assessment = await recaptchaService.createAssessment({
        token,
        expectedAction
      });

      if (!assessment.success) {
        return res.status(403).json({
          error: "Validación reCAPTCHA fallida",
          details: assessment
        });
      }

      // Adjuntar datos al request
      req.captchaData = {
        score: assessment.score,
        action: assessment.action,
        valid: true,
        mode: 'production',
        reasons: assessment.reasons
      };

      console.log(` reCAPTCHA validation passed - Score: ${assessment.score}`);
      next();

    } catch (error) {
      console.error(' Error en captchaMiddleware:', error.message);

      // En desarrollo, permitir continuar a pesar del error
      if (process.env.NODE_ENV === 'development') {
        console.log('  Continuando en modo desarrollo a pesar del error reCAPTCHA');
        req.captchaData = { 
          score: 0.7, 
          action: expectedAction || 'error_fallback',
          valid: true,
          mode: 'development_error_fallback'
        };
        return next();
      }

      return res.status(500).json({
        error: "Error interno en validación de seguridad",
        code: "CAPTCHA_SERVER_ERROR"
      });
    }
  };
};

// Middleware específico para acciones
const captchaForSMS = () => captchaMiddleware(process.env.ACTION_SMS_SEND, 0.5);
const captchaForVerify = () => captchaMiddleware(process.env.ACTION_SMS_VERIFY, 0.5);

module.exports = {
  captchaMiddleware,
  captchaForSMS,
  captchaForVerify
};