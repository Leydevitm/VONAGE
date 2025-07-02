
const { Router } = require('express');

const router = Router();

router.get('/prueba', (req, res) => {
    res.json({ msg: 'Servidor activo' });
});

module.exports = router;
