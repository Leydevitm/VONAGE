const crypto = require ( "crypto");

 const generateSign = (payload) => {
  const SECRET = process.env.HMAC_SECRET;
   const payloadString = canonicalString(payload);
  return crypto
    .createHmac("sha256", SECRET)
    .update(payloadString)
    .digest("hex");
};
function canonicalString(obj) {
  if (!obj || typeof obj !== 'object') return '{}';
  
  return JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((res, key) => {
        // Manejar valores undefined/null
        res[key] = obj[key] !== undefined ? obj[key] : null;
        return res;
      }, {})
  );
}


module.exports = generateSign;