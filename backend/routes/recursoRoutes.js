const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const recursoController = require('../controllers/recursoController');
const authMiddleware = require('../middleware/authMiddleware');

// Configuración de Multer para almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // La carpeta 'uploads/recursos' debe existir dentro de tu carpeta 'backend'
        cb(null, 'uploads/recursos/'); 
    },
    filename: function (req, file, cb) {
        // Generar un nombre de archivo único para evitar colisiones
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Filtro para tipos de archivo (opcional, pero recomendado)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // Aceptar archivo
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo PDF, JPG, PNG.'), false); // Rechazar archivo
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // Límite de 10MB por archivo
    },
    fileFilter: fileFilter
});

// POST /api/recursos - Asesor crea un nuevo recurso (puede incluir un archivo)
// 'archivoRecurso' es el nombre del campo en el FormData que contendrá el archivo
router.post(
    '/', 
    authMiddleware, // Primero verifica autenticación y rol
    upload.single('archivoRecurso'), // Luego procesa la subida del archivo (si existe)
    recursoController.crearRecurso
);

// GET /api/recursos - Obtener todos los recursos públicos (o filtrados)
router.get('/', authMiddleware, recursoController.listarRecursosPublicos); // authMiddleware es opcional aquí

// GET /api/recursos/mis-recursos - Asesor obtiene sus recursos
router.get('/mis-recursos', authMiddleware, recursoController.listarMisRecursos);

// DELETE /api/recursos/:id - Asesor elimina su recurso
router.delete('/:id', authMiddleware, recursoController.eliminarRecurso);

router.get('/:id', authMiddleware, recursoController.obtenerRecursoPorId);
router.put('/:id', authMiddleware, recursoController.actualizarRecurso);


module.exports = router;
