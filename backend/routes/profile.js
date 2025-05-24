const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

// Actualiza el perfil
router.put('/update', verifyToken, (req, res) => {
  // Lógica para actualizar perfil
  res.json({ message: 'Perfil actualizado' });
});

// Obtener perfil
router.get('/', verifyToken, (req, res) => {
  // Lógica para obtener datos del perfil
  res.json({ carrera: 'Ejemplo', semestre: 6 });
});

module.exports = router;
