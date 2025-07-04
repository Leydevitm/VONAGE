const bcrypt = require('bcrypt');
const VerificationCode = require('../models/verificationCode');
const blockedPhone = require('../models/blockedPhone');
const logger = require('../utils/logger');

const maxTries = 5; 

async function verifyCode(phone, code) {

    const registros = await VerificationCode.find({
        phone, 
        status:'pendiente',
        expiresAt: {$gt: new Date()}

    }).sort({createAt: -1});

    if(registros.length===0){
        logger.warn(`Sin codigos vigentes para ${phone}`);
        return {ok:false , mensaje: 'codigo inexistente o expirado'};
    }

    for (const reg of registros) {
        if(await bcrypt.compare(code, reg.code)){
            reg.status = 'verificado';
            reg.verifiedAt= new Date();
            await reg.save()

            logger.info(`Verificado ok (ID: ${reg._id}) para ${phone}`);
            return {ok:true, mensaje: 'codigo correcto'}; 
        }
          
        
    }

    const mostRecent = registros[0];
    mostRecent.filedAttempts+=1;
    await mostRecent.save();

    logger.warn(`Codigo Incorrecto (${mostRecent.filedAttempts}/${maxTries}) para ${phone}`);

    if(mostRecent.filedAttempts >= maxTries){
        await blockNumber(phone);
        }
        return {ok:false, mensaje: 'codigo incorrecto'};
}

async function blockNumber(phone){
    const currentTime = new Date();
    const base15m = 15*60*100;

    const doc= await blockedPhone.findOne({phone});
    if(doc){
        doc.recurrences += 1; 
        doc.locked_at= currentTime;
        doc.unlocked_at= new Date(currentTime.getTime() + base15m * doc.recurrences);
        await doc.save();
        logger.warn(`Re-bloqueo ${phone} ( recurrence: ${doc.recurrences})`);
        }else{
            await blockedPhone.create({
                phone,
                locked_at: currentTime,
                unlocked_at: new Date(currentTime.getTime() + base15m),
                recurrences:1

            })
            logger.warn(`Bloqueo inicial ${phone} (15min)`);
        }
}

module.exports=  verifyCode


