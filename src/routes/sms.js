const { Router } = require('express');
const { startVerificationController, checkVerificationController } = require('../controllers/smsController');
const attemptLimit = require('../middlewares/attemptLimit');
const router = Router();

router.post('/start', attemptLimit, startVerificationController);
router.post('/check', attemptLimit, checkVerificationController);

module.exports = router;