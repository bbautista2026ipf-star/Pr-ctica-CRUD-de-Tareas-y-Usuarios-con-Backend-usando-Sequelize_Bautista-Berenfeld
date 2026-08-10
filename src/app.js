import 'dotenv/config';
import express from 'express';
import db from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas principales de la API
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta raíz de bienvenida
app.get('/', (req, res) => {
    res.status(200).json({
        message: '✅ API RESTful - Instituto Politécnico Formosa',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            tasks: '/api/tasks',
        },
    });
});

// Inicialización del servidor con sincronización de Sequelize
const startServer = async () => {
    try {
        await db.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        await db.sync(); // Crea las tablas automáticamente si no existen
        console.log('✅ Tablas sincronizadas con la base de datos.');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`   GET  http://localhost:${PORT}/api/users`);
            console.log(`   GET  http://localhost:${PORT}/api/tasks`);
        });
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error.message);
        process.exit(1);
    }
};

startServer();
