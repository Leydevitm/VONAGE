
const basicAuth = require('basic-auth');


const authMiddleware = (req,res,next) => {
    const user = basicAuth(req);

    if(!user || !user.name || !user.pass){
        res.set('WWW-Authenticate', 'Basic realm="vonage-service"');
        return res.status(401).json({ msg: 'Credenciales requeridas: usuario y contraseña' });
    }
    const { name: inputUser, pass: inputPass } = user;
    const validUser = inputUser === process.env.BASIC_AUTH_USER;
    const validPass = inputPass === process.env.BASIC_AUTH_PASS;

   if (!validUser && !validPass) {
    return res.status(401).json({ msg: 'Credenciales incorrectas' });
  }
    next();
}
module.exports = authMiddleware;