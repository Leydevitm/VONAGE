
const mongoose = require('mongoose');

const VerificationCode = new mongoose.Schema({

    phone:{
        type: String,
        required: true 
    },
    code:{
        type:String,
        required: true
    },
    provider:{
        type:String, 
        enum: ['Vonage', 'Neutrino'],
        required: true
    },
    status: {
        type: String, 
        enum: ['pendiente', 'verificado', 'expirado', 'fallido', 'bloqueado'],
        default: 'pendiente'
    },
    createdAt:{
        type:Date, 
       required: true,
       default: Date.now
    },
    expiresAt: {
       type: Date,
       required: true
    },
    updatedAt: {
        type:Date,
        
    },
    filedAttempts:{
        type: Number,
        default: 0
    },
    verifiedAt: Date

},{ timestamps: true }); 

module.exports = mongoose.model('VerificationCode', VerificationCode);