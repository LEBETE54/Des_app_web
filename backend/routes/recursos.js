const express = require('express');
const router = express.Router();
const controller = require('../controllers/recursosController');

router.get('/', controller.getRecursos);
router.post('/', controller.createRecurso);
router.put('/:id', controller.updateRecurso);
router.delete('/:id', controller.deleteRecurso);

module.exports = router;
