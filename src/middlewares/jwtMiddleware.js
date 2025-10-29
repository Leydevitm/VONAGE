
const { verifyToken } = require('../services/jwtService.js');

function verifyJwt(req, res, next) {
  console.log(' JWT Middleware - Headers:', req.headers);
  
  const authHeader = req.headers['authorization'];
  console.log(' Authorization Header:', authHeader);
  
  if (!authHeader) {
    console.log(' No Authorization header found');
    return res.status(401).json({ error: 'Token faltante' });
  }

  const token = authHeader.split(' ')[1]; 
  console.log('Extracted Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
  
  if (!token) {
    console.log(' No token found after Bearer');
    return res.status(401).json({ error: 'Token faltante' });
  }

  try {
    const decoded = verifyToken(token);
    console.log('Token válido, decoded:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(' Token inválido:', err.message);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verifyJwt;



// const { verifyToken } = require ( '../services/jwtService.js');

//  function verifyJwt(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader) return res.status(401).json({ error: 'Token faltante' });

//   const token = authHeader.split(' ')[1]; 
//   if (!token) return res.status(401).json({ error: 'Token faltante' });

//   try {
//     const decoded = verifyToken(token);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: 'Token inválido o expirado' });
//   }
// }

// module.exports = verifyJwt;