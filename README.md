
# 📲 Microservicio de Verificación SMS con Vonage

Este proyecto es una API REST construida en Node.js que permite verificar números telefónicos mediante SMS usando Vonage Verify. Incluye autenticación básica, hmac, jwt soporte para CORS y está listo para ser desplegado en Docker.

---

## 📦 Requisitos

- Node.js 18 o superior
- Docker y Docker Compose
- Cuenta Vonage con servicio Verify
- Carpeta `logs/` creada con permisos (el sistema lo crea si no existe)


## 🔧 Configuración de Variables de entorno

1. Clona el repositorio y copia el archivo `.env.example` a `.env`.

```bash
cp .env.example .env
```

2. Completa las variables en el archivo `.env`:

BASIC_AUTH_USER=
BASIC_AUTH_PASS=

MONGO_URI=
PORT=
ALLOWED_ORIGINS=

VONAGE_API_KEY=
VONAGE_API_SECRET=


VONAGE_BRAND_NAME=
MONGODB_CNN=mongodb:

HMAC_SECRET=
JWT_SECRET=

RECAPTCHA_PROJECT_ID=
RECAPTCHA_SITE_KEY=
GOOGLE_APPLICATION_CREDENTIALS=

HMAC_SECRET=
JWT_SECRET=


ACTION_SMS_SEND=
ACTION_SMS_VERIFY=


### En archivo:

```bash
cat logs/app-YYYY-MM-DD.log
```

Los logs se almacenan en `logs/` y se rotan diariamente:

- `backend-YYYY-MM-DD.log`: logs generales (info, warn, error)
- `error.log`: errores críticos acumulados

> Winston crea automáticamente los archivos con compresión `.gz` para logs antiguos.
