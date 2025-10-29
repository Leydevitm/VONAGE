const { Router } = require('express');
const { startVerificationController, checkVerificationController } = require('../controllers/smsController');
const attemptLimit = require('../middlewares/attemptLimit');
const { captchaForSMS, captchaForVerify } = require('../middlewares/recaptchaMiddleware');
const verifyJwt = require('../middlewares/jwtMiddleware');
const hmacMiddleware = require('../middlewares/hmacMiddleware');
const router = Router();

router.post('/send-code',
verifyJwt,      
hmacMiddleware, 
captchaForSMS(), 
attemptLimit,
startVerificationController
);

router.post('/verify-code',
verifyJwt,       
hmacMiddleware,  
captchaForVerify(), 
attemptLimit, 
checkVerificationController
);

module.exports = router;