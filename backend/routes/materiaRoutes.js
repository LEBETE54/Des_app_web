// Ruta: backend/routes/materiaRoutes.js
const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materiaController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para proteger rutas

// GET /api/materias - Obtener todas las materias
// Esta ruta es consultada por los asesores al crear horarios y por estudiantes al buscar.
// Podría ser pública o requerir solo autenticación básica.
// Si es pública para cualquiera, puedes quitar authMiddleware.
// Si solo usuarios logueados pueden verla, mantenlo.
router.get('/', authMiddleware, materiaController.listarTodasLasMaterias);

// POST /api/materias - Crear una nueva materia (Ejemplo para Admin)
// Esta ruta debería estar protegida y solo accesible para administradores.
// Necesitarías añadir una verificación de rol dentro del controlador o un middleware de rol.
// router.post('/', authMiddleware, /* middlewareRolAdmin, */ materiaController.crearMateria);

// (Otras rutas para GET por ID, PUT, DELETE si las implementas)
// router.get('/:id', authMiddleware, materiaController.obtenerMateriaPorId);
// router.put('/:id', authMiddleware, /* middlewareRolAdmin, */ materiaController.actualizarMateria);
// router.delete('/:id', authMiddleware, /* middlewareRolAdmin, */ materiaController.eliminarMateria);

module.exports = router;
    