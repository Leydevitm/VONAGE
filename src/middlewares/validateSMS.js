
const logger = require('../utils/logger');

function verificarIntentos(req,res, next){
    const phone = req.body.phone; 

    if(locked){
        logger.warn(`Numero bloqueado por exceso de intentos: ${phone}`);
        return res.status(429).json({error: `Supero el numero de intentos `});
    }
    next();
}
