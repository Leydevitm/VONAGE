const { Router } = require('express');
const { startVerificationController, checkVerificationController } = require('../controllers/smsController');
const attemptLimit = require('../middlewares/attemptLimit');
const { captchaForSMS, captchaForVerify } = require('../middlewares/recaptchaMiddleware');
const verifyJwt = require('../middlewares/jwtMiddleware');
const hmacMiddleware = require('../middlewares/hmacMiddleware');
const router = Router();

router.post('/send-code',
hmacMiddleware,
verifyJwt,      
 captchaForSMS(), 
attemptLimit,
startVerificationController
);

router.post('/verify-code',
hmacMiddleware,
verifyJwt,
captchaForVerify(),
attemptLimit,
checkVerificationController
);

module.exports = router;