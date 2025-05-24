const express = require('express');
const router = express.Router();
const db = require('../models/db');
const verifyToken = require('../middlewares/verifyToken');

// Obtener todas las asesorías disponibles (Buscar Asesorías)
router.get('/asesorias', async (req, res) => {
  try {
    const [asesorias] = await db.query(`
      SELECT a.*, u.nombre as tutor_nombre 
      FROM asesorias a
      JOIN usuarios u ON a.tutor_id = u.id
      WHERE a.estado = 'disponible'
    `);
    res.json(asesorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener asesorías' });
  }
});

// Obtener mis asesorías (usuario logueado)
router.get('/mis-asesorias', verifyToken, async (req, res) => {
  try {
    const [asesorias] = await db.query(`
      SELECT a.*, u.nombre as tutor_nombre 
      FROM asesorias a
      JOIN usuarios u ON a.tutor_id = u.id
      WHERE a.estudiante_id = ? OR a.tutor_id = ?
    `, [req.user.id, req.user.id]);
    
    res.json(asesorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener asesorías' });
  }
});

// Agendar nueva asesoría
router.post('/asesorias', verifyToken, async (req, res) => {
  try {
    const { tutor_id, fecha, tema } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO asesorias 
        (tutor_id, estudiante_id, fecha, tema, estado)
      VALUES (?, ?, ?, ?, 'pendiente')`,
      [tutor_id, req.user.id, fecha, tema]
    );
    
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error al agendar asesoría' });
  }
});

module.exports = router;