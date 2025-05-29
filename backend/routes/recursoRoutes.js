const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const recursoController = require('../controllers/recursoController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/recursos/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Filtro para tipos de archivo 
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); 
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo PDF, JPG, PNG.'), false); 
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});


router.post(
    '/', 
    authMiddleware, // Primero verifica autenticación y rol
    upload.single('archivoRecurso'), // Luego procesa la subida del archivo (si existe)
    recursoController.crearRecurso
);

router.get('/', authMiddleware, recursoController.listarRecursosPublicos); // authMiddleware es opcional aquí

router.get('/mis-recursos', authMiddleware, recursoController.listarMisRecursos);

router.delete('/:id', authMiddleware, recursoController.eliminarRecurso);

module.exports = router;
