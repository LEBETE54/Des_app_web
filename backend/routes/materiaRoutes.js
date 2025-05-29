const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materiaController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para proteger rutas


router.get('/', authMiddleware, materiaController.listarTodasLasMaterias);



module.exports = router;
    