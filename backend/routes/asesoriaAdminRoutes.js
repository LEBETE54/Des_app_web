// RUTAS (routes/asesoriaAdminRoutes.js)
const express = require('express');
const router = express.Router();
const asesoriaAdminController = require('../controllers/asesoriaAdminController');

router.get('/:id', asesoriaAdminController.obtenerAsesoriaPorId);
router.put('/:id', asesoriaAdminController.actualizarAsesoria);
router.delete('/:id', asesoriaAdminController.eliminarAsesoria);
router.delete('/:id/alumnos/:alumnoId', asesoriaAdminController.eliminarAlumnoDeAsesoria);
router.get('/:id/alumnos', asesoriaAdminController.obtenerAlumnosDeAsesoria);
router.get('/tutor/:id/ultima', asesoriaAdminController.obtenerUltimaAsesoriaDeTutor);



module.exports = router;
