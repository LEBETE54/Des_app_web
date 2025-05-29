const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para proteger rutas


router.post('/', authMiddleware, horarioController.crearHorario);

router.get('/mis-horarios', authMiddleware, horarioController.obtenerMisHorarios);

router.put('/:id', authMiddleware, horarioController.actualizarHorario);

router.delete('/:id', authMiddleware, horarioController.eliminarHorario);



router.get('/disponibles-para-reserva', authMiddleware, horarioController.listarHorariosDisponiblesParaEstudiantes);


router.get('/:id', authMiddleware, horarioController.obtenerHorarioPorId);


module.exports = router;
