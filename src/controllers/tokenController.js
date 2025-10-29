const { generatePublicToken } = require( "../services/jwtService.js");

const generateToken = (req, res) => {
  try {
    const token = generatePublicToken();
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Ocurrió un error al generar token" });
  }
};

module.exports = generateToken;