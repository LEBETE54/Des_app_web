const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener datos del dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Datos del usuario
    const [user] = await db.query(`
      SELECT u.*, GROUP_CONCAT(h.habilidad) AS habilidades 
      FROM usuarios u
      LEFT JOIN habilidades h ON u.id = h.usuario_id
      WHERE u.id = ?
      GROUP BY u.id
    `, [userId]);

    // Asesorías recientes
    const [asesorias] = await db.query(
      'SELECT * FROM asesorias WHERE usuario_id = ? ORDER BY fecha DESC LIMIT 3',
      [userId]
    );

    // Recursos destacados
    const [recursos] = await db.query(
      'SELECT * FROM recursos ORDER BY RAND() LIMIT 3'
    );

    res.json({
      usuario: {
        ...user[0],
        habilidades: user[0].habilidades ? user[0].habilidades.split(',') : []
      },
      asesorias,
      recursos
    });

  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({ message: 'Error al cargar el dashboard' });
  }
});

module.exports = router;