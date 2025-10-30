
const { sendSMS } = require('../services/vonageVerifyService');
const sanitizePhone = require('../utils/phoneSanitizer');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');
const VerificationCode = require('../models/verificationCode');
const blockedPhone = require('../models/blockedPhone');
const verifyCodeSchema = require('./validatorCode');

const maxTries = 5;
const blockBaseTime = 15 * 60 * 1000;


function generateCode(length = 6) {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return code;
}

async function sendCode(phone) {
    try {
        console.log('Iniciando envío de código para:', phone);
        
        const sanitizedPhone = sanitizePhone(phone);
        console.log('Teléfono sanitizado:', sanitizedPhone);

        if (!sanitizedPhone) {
            console.log('Teléfono inválido');
            return {
                ok: false,
                message: 'Número de teléfono inválido'
            };
        }

        
        const plainCode = generateCode(6);
        console.log('Código generado..');
        
        const hashedCode = await bcrypt.hash(plainCode, 10);
        console.log('Código hasheado');

        
        const expirationMinutes = 5;
        const now = new Date();
        const expiresAt = new Date(now.getTime() + expirationMinutes * 60000);

        
        const saved = await VerificationCode.create({
            phone: sanitizedPhone,
            code: hashedCode,
            provider: 'Vonage',
            status: 'pendiente',
            createdAt: now,
            expiresAt,
            filedAttempts: 0
        });

        console.log(' Registro guardado en BD con ID:', saved._id);

        // Enviar SMS con el código plano
        const mensaje = `Vonage:Your Super Kompras verification code is: ${plainCode}.`;
        console.log(' Enviando SMS...');
        
        const smsResult = await sendSMS(sanitizedPhone, mensaje);
        console.log(' Resultado SMS:', smsResult);

        if (!smsResult.sent) {
            // Si falla el envío, eliminar el registro
            await VerificationCode.findByIdAndDelete(saved._id);
            console.log(' Error enviando SMS, registro eliminado');
            
            return {
                ok: false,
                message: 'Error enviando el código SMS',
                error: smsResult.error || smsResult['status-message']
            };
        }

        console.log(' SMS enviado correctamente');

        return {
            ok: true,
            message: 'Código de verificación enviado correctamente',
            phone: sanitizedPhone,
            expiresAt: expiresAt.toISOString()
        };

    } catch (error) {
        console.error('Error en sendCode:', error);
        logger.error('Excepción al iniciar verificación:', {
            mensaje: error.message,
            stack: error.stack
        });

        return {
            ok: false,
            message: 'Error interno al iniciar verificación',
            error: error.message
        };
    }
}

const bloquearTelefono = async (phone) => {
    const ahora = new Date();
    const doc = await blockedPhone.findOne({ phone });

    if (doc) {
        doc.recurrences += 1;
        doc.locked_at = ahora;
        doc.unlocked_at = new Date(ahora.getTime() + blockBaseTime * doc.recurrences);
        await doc.save();
        logger.warn(`Re-bloqueo ${phone} (recurrencias: ${doc.recurrences})`);
    } else {
        await blockedPhone.create({
            phone,
            locked_at: ahora,
            unlocked_at: new Date(ahora.getTime() + blockBaseTime),
            recurrences: 1
        });
        logger.warn(`Bloqueo inicial de ${phone}`);
    }
};

const checkVerifyCode = async (phone, code) => {
    try {
        const parseResult = verifyCodeSchema.safeParse({ phone, code });

        if (!parseResult.success) {
            const zodErrors = parseResult.error?.issues || [];
            const mensajes = zodErrors.map(err => err.message).join(', ');
            console.log('Validación fallida:', mensajes);
            
            return {
                ok: false,
                message: `Datos inválidos: ${mensajes}`
            };
        }

        // Buscar la solicitud de verificación más reciente
        const registro = await VerificationCode.findOne({
            phone,
            status: 'pendiente',
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        console.log('Registro encontrado:', registro ? registro._id : 'Ninguno');

        if (!registro) {
            return {
                ok: false,
                message: 'Solicitud de verificación inexistente o expirada'
            };
        }

        if (!registro.code) {
            return {
                ok: false,
                message: 'Error en la solicitud de verificación'
            };
        }

        // Verificar el código usando bcrypt.compare
        console.log(' Comparando códigos...');
        const isCodeValid = await bcrypt.compare(code, registro.code);
        console.log(' Resultado comparación:', isCodeValid);

        if (isCodeValid) {
            // Código correcto
            registro.status = 'verificado';
            registro.verifiedAt = new Date();
            await registro.save();

            console.log('Código verificado correctamente');
            return {
                ok: true,
                message: 'Código verificado correctamente'
            };
        } else {
            // Código incorrecto
            registro.filedAttempts += 1;
            await registro.save();

            console.log(' Código incorrecto, intentos:', registro.filedAttempts);

            if (registro.filedAttempts >= maxTries) {
                await bloquearTelefono(phone);
                return {
                    ok: false,
                    message: 'Número bloqueado temporalmente por demasiados intentos fallidos'
                };
            }

            return {
                ok: false,
                message: 'Código incorrecto',
                attempts: registro.filedAttempts,
                remaining: maxTries - registro.filedAttempts
            };
        }

    } catch (err) {
        console.error('Error en checkVerifyCode:', err);
        logger.error('Error al verificar código: ' + err.message);
        
        return {
            ok: false,
            message: 'Error interno al verificar código',
            error: err.message
        };
    }
};

module.exports = {
    sendCode,
    checkVerifyCode
};