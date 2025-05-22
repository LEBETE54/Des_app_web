// controllers/asesoriasController.js
const db = require("../models/db");

// Obtener todas las asesorías
exports.getAsesorias = (req, res) => {
  const sql = "SELECT * FROM asesorias";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.json(results);
  });
};

// Buscar asesorías por materia
exports.buscarPorMateria = (req, res) => {
  const { materia } = req.params;
  const sql = "SELECT * FROM asesorias WHERE materia = ?";
  db.query(sql, [materia], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.json(results);
  });
};
