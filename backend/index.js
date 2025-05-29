// Ruta: backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // Necesario para servir archivos estáticos
require('dotenv').config();
const dbConnection = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// --- SERVIR ARCHIVOS ESTÁTICOS ---
// Esto permitirá que el frontend acceda a los archivos subidos en la carpeta 'uploads'
// Por ejemplo, si un archivo se guarda como 'uploads/recursos/miarchivo.pdf',
// el frontend podrá acceder a él en 'http://localhost:4000/uploads/recursos/miarchivo.pdf'
// OJO: La ruta en el primer argumento de express.static es relativa a donde inicias node.
// Si inicias node desde `backend/`, entonces 'uploads' es correcto.
// Si inicias desde `studenconnectpriv-main/`, sería 'backend/uploads'.
// Usaremos path.join para hacerlo más robusto:
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

// --- NUEVA RUTA PARA RECURSOS ---
app.use('/api/recursos', require('./routes/recursoRoutes'));
console.log("-> Rutas de /api/recursos configuradas.");

// app.use('/api/asesorias', require('./routes/asesorias')); // Si aún la usas
// console.log("-> Rutas de /api/asesorias (existentes) configuradas.");


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
