// Ruta: backend/routes/horarioRoutes.js
const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para proteger rutas

// --- Rutas para Asesores (requieren ser rol 'asesor') ---
// POST /api/horarios - Asesor crea un nuevo slot de horario disponible
router.post('/', authMiddleware, horarioController.crearHorario);

// GET /api/horarios/mis-horarios - Asesor obtiene sus horarios de disponibilidad
router.get('/mis-horarios', authMiddleware, horarioController.obtenerMisHorarios);

// PUT /api/horarios/:id - Asesor actualiza uno de sus horarios
router.put('/:id', authMiddleware, horarioController.actualizarHorario);

// DELETE /api/horarios/:id - Asesor elimina uno de sus horarios (si está disponible)
router.delete('/:id', authMiddleware, horarioController.eliminarHorario);


// --- Rutas para Estudiantes (o usuarios autenticados en general) ---
// GET /api/horarios/disponibles-para-reserva - Estudiantes buscan horarios disponibles
// Se puede proteger con authMiddleware si solo usuarios logueados pueden buscar,
// o quitarlo si la búsqueda es pública.
router.get('/disponibles-para-reserva', authMiddleware, horarioController.listarHorariosDisponiblesParaEstudiantes);

// GET /api/horarios/:id - Obtener un horario específico por ID (para ver detalle)
// Protegido para usuarios autenticados.
router.get('/:id', authMiddleware, horarioController.obtenerHorarioPorId);


module.exports = router;
