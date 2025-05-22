const express = require('express');
const router = express.Router();
const asesoriasController = require('../controllers/asesoriasController');

router.get('/', asesoriasController.getAsesorias);
router.get('/materia/:materia', asesoriasController.buscarPorMateria);

module.exports = router;
