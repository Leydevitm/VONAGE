
//import basicAuth from 'basic-auth';
const basicAuth = require('basic-auth');


const authMiddleware = (req,res,next) => {
    const user = basicAuth(req);

    if(!user || user.name !== process.env.BASIC_AUTH_USER || user.pass !== process.env.BASIC_AUTH_PASS){
        res.set('WWW-Authenticate', 'Basic realm="vonage-verifier"');
        return res.status(401).json({ status:'unauthorized', message:'Authentication failed.', });
    }
    next();
}
module.exports = authMiddleware;