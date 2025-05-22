const db = require('../models/db');

// Obtener todas las asesorías
exports.getAsesorias = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM asesorias WHERE estado = "disponible"');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asesorías' });
  }
};

// Buscar asesorías por materia
exports.buscarPorMateria = async (req, res) => {
  const { materia } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM asesorias WHERE materia LIKE ?', [`%${materia}%`]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar asesorías por materia' });
  }
};
