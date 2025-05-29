const express = require('express');
const router = express.Router();
const controller = require('../controllers/asesoriasController');

router.get('/', controller.getAsesorias);
router.post('/', controller.createAsesoria);
router.put('/:id', controller.updateAsesoria);
router.delete('/:id', controller.deleteAsesoria);

module.exports = router;
