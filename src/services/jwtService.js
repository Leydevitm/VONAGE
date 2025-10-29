const jwt = require( 'jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

 function generatePublicToken() {
  const payload = { type: "public" };
  const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
  return token;
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw error;
  }
}

module.exports = {generatePublicToken,verifyToken
};