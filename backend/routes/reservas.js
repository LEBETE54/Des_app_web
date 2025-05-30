const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Registrar una nueva reserva
router.post('/', (req, res) => {
  const { horario_disponibilidad_id, estudiante_usuario_id } = req.body;

  const sql = `
    INSERT INTO reservas_estudiantes 
    (horario_disponibilidad_id, usuario_id, estado_reserva)
    VALUES (?, ?, 'confirmada')
  `;

  db.query(sql, [horario_disponibilidad_id, estudiante_usuario_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId });
  });
});


router.get('/por-estudiante/:id', (req, res) => {
  const estudianteId = req.params.id;

  const query = `
    SELECT 
      r.id AS reserva_id,
      r.estado_reserva,
      r.horario_disponibilidad_id,
      h.titulo_asesoria,
      h.fecha_hora_inicio,
      h.fecha_hora_fin,
      h.enlace_o_lugar,
      u.nombre_completo AS nombre_asesor
    FROM reservas_estudiantes r
    JOIN horarios_disponibles_asesor h ON r.horario_disponibilidad_id = h.id
    JOIN usuarios u ON h.asesor_usuario_id = u.id
    WHERE r.usuario_id = ?
  `;

  db.query(query, [estudianteId], (err, results) => {
    if (err) {
      console.error("Error al obtener asesorías inscritas:", err);
      return res.status(500).json({ error: "Error al obtener asesorías inscritas" });
    }
    res.json(results);
  });
});


module.exports = router;
