// backend/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/:id', usuarioController.obtenerPerfilPorId); // <-- ESTA ES LA QUE NECESITAS
router.put('/:id', usuarioController.actualizarPerfilUsuario); // para guardar cambios

module.exports = router;
