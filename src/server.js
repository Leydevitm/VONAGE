const express = require('express');
const { createServer } = require('http');
const { dbConnection } = require('./database/config');

const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const smsRoutes = require('./routes/sms'); 
const tokenRoutes = require('./routes/token');  
const hmacRoutes = require('./routes/hmac');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT || 8080;
        this.server = createServer(this.app);

        this.paths = {
            sms: '/api/sms',
            token: '/api/token',
            hmac: '/api/hmac'
        };    

        // Conexion a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        // this.app.use(authMiddleware);
    }

    routes() {
        this.app.use(this.paths.sms, smsRoutes);
        this.app.use(this.paths.token, tokenRoutes);
        this.app.use(this.paths.hmac, hmacRoutes);
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
            
        });
    }
}

module.exports = Server;
