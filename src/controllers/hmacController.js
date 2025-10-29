const  generateSign  = require ( "../services/hmacService.js");

const generateHmacSign = (req, res) => {
  try {
    const sign = generateSign(req.body); 
    return res.status(200).json({ sign });
  } catch (error) {
    return res.status(403).json({ error: "Ocurrió un error al generar firma cifrada" });
  }
};
module.exports = generateHmacSign;