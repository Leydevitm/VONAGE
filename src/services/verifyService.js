const {Auth } = require('@vonage/auth')
const {SMS} = require('@vonage/sms')


const credenciales = new Auth({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,

});

const inicarVerificacion= async(phone,brand = 'Verificacion' )=>{
    return new Promise((resolve,reject)=>{
        credenciales.verify.start({ number:phone , brand}, (err,result)=>{
            if(err){
               

            }
        })

    })
} 
const options ={};
const smsCliente = new (credenciales,options)