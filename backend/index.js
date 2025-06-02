// Ruta: backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();
const multer = require('multer');
const dbConnection = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(`Sirviendo archivos estáticos desde: ${path.join(__dirname, 'uploads')}`);


// --- Definición de Rutas de la API ---
console.log("Configurando rutas de la API...");
app.use('/api/auth', require('./routes/authRoutes'));
console.log("-> Rutas de /api/auth configuradas.");
app.use('/api/materias', require('./routes/materiaRoutes'));
console.log("-> Rutas de /api/materias configuradas.");
app.use('/api/horarios', require('./routes/horarioRoutes'));
console.log("-> Rutas de /api/horarios configuradas.");
app.use('/api/recursos', require('./routes/recursoRoutes'));
console.log("-> Rutas de /api/recursos configuradas.");
app.use('/api/asesorias', require('./routes/asesorias'));
console.log("-> Rutas de /api/asesorias configuradas.");
app.use('/api/reservas', require('./routes/reservas'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/asesoria-admin', require('./routes/asesoriaAdminRoutes'));
console.log("-> Rutas de /api/asesoria-admin configuradas.");




app.use((err, req, res, next) => {
    console.error("ERROR NO CAPTURADO:", err.stack || err.message || err);
    // Si es un error de multer (ej. tipo de archivo no permitido)
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ mensaje: `Error de Multer: ${err.message}` });
    } else if (err) {
        // Otro tipo de error (ej. el fileFilter personalizado)
        return res.status(400).json({ mensaje: err.message || 'Error con la subida del archivo.' });
    }
    res.status(500).send({ mensaje: '¡Algo salió muy mal en el servidor!', detalle: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("------------------------------------------------------");
  console.log(`Servidor backend StudentConnectPriv iniciado en http://localhost:${PORT}`);
  console.log("------------------------------------------------------");
});
