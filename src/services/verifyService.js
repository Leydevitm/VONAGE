const bcrypt = require('bcrypt');
const VerificationCode = require('../models/verificationCode');
const blockedPhone = require('../models/blockedPhone');
const logger = require('../utils/logger');
const codeGenerator = require('../utils/codeGenerator');
const sendSMS = require('./vonageVerifyService');

const maxTries = 5;
const blockBaseTime = 15 * 60 * 1000;

async function startVerification(phone, provider = 'Vonage') {
    try {
        const codigo = codeGenerator();
        const hash = await bcrypt.hash(codigo, 10);
        const expiracion = new Date(Date.now() + 5 * 60000);

        const doc = await VerificationCode.create({ phone, code: hash, provider, expiresAt: expiracion });
        logger.info(`Código generado ID: ${doc._id} para ${phone}, expira en ${expiracion}`);

        const mensaje = `Tu código de verificación es: ${codigo}`;
        const enviado = await sendSMS(phone, mensaje);

        if (!enviado) {
            logger.warn(`SMS no enviado a ${phone}. Código sigue pendiente.`);
            return { ok: false, mensaje: 'Código generado pero SMS no enviado', registroId: doc._id };
        }

        return { ok: true, mensaje: 'Código generado y SMS enviado', registroId: doc._id };
    } catch (error) {
        logger.error(`Error generando y guardando código para ${phone}: ${error.message}`);
        return { ok: false, mensaje: 'Error interno al generar el código', error: error.message };
    }
}

async function checkVerification(phone, code) {
    const registros = await VerificationCode.find({ phone, status: 'pendiente', expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });

    if (registros.length === 0) {
        logger.warn(`Sin códigos vigentes para ${phone}`);
        return { ok: false, mensaje: 'Código inexistente o expirado' };
    }

    for (const reg of registros) {
        if (await bcrypt.compare(code, reg.code)) {
            reg.status = 'verificado';
            reg.verifiedAt = new Date();
            await reg.save();
            logger.info(`Verificación correcta (ID: ${reg._id}) para ${phone}`);
            return { ok: true, mensaje: 'Código correcto' };
        }
    }

    const mostRecent = registros[0];
    mostRecent.filedAttempts += 1;
    await mostRecent.save();
    logger.warn(`Código incorrecto (${mostRecent.filedAttempts}/${maxTries}) para ${phone}`);

    if (mostRecent.filedAttempts >= maxTries) {
        await blockNumber(phone);
    }

    return { ok: false, mensaje: 'Código incorrecto' };
}

async function blockNumber(phone) {
    const now = new Date();
    const doc = await blockedPhone.findOne({ phone });
    if (doc) {
        doc.recurrences += 1;
        doc.locked_at = now;
        doc.unlocked_at = new Date(now.getTime() + blockBaseTime * doc.recurrences);
        await doc.save();
        logger.warn(`Re-bloqueo ${phone} (recurrence: ${doc.recurrences})`);
    } else {
        await blockedPhone.create({ phone, locked_at: now, unlocked_at: new Date(now.getTime() + blockBaseTime), recurrences: 1 });
        logger.warn(`Bloqueo inicial ${phone} (15min)`);
    }
}

module.exports = { startVerification, checkVerification };