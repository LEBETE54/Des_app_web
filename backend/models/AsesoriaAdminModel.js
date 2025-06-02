// ✅ MODELO (models/AsesoriaAdminModel.js)
const db = require('../config/db');

const AsesoriaAdminModel = {
  obtenerPorId: (id, callback) => {
    const query = `SELECT * FROM horarios_disponibles_asesor WHERE id = ?`;
    db.query(query, [id], callback);
  },

  actualizar: (id, data, callback) => {
    const campos = [
      data.titulo_asesoria,
      data.descripcion_asesoria,
      data.fecha_hora_inicio,
      data.fecha_hora_fin,
      data.modalidad,
      data.enlace_o_lugar,
      id
    ];

    const query = `
      UPDATE horarios_disponibles_asesor SET
        titulo_asesoria = ?,
        descripcion_asesoria = ?,
        fecha_hora_inicio = ?,
        fecha_hora_fin = ?,
        modalidad = ?,
        enlace_o_lugar = ?
      WHERE id = ?
    `;
    db.query(query, campos, callback);
  },

  eliminar: (id, callback) => {
    const query = `DELETE FROM horarios_disponibles_asesor WHERE id = ?`;
    db.query(query, [id], callback);
  },

  eliminarAlumno: (asesoriaId, alumnoId, callback) => {
  const query = `
    DELETE FROM reservas_estudiantes 
    WHERE horario_disponibilidad_id = ? AND usuario_id = ?
  `;
  db.query(query, [asesoriaId, alumnoId], callback);
},


 obtenerAlumnos: (id, callback) => {
  const query = `
    SELECT u.id, u.nombre_completo AS nombre, u.carrera, u.correo
    FROM reservas_estudiantes r
    JOIN usuarios u ON u.id = r.usuario_id
    WHERE r.horario_disponibilidad_id = ?
  `;
  db.query(query, [id], callback);
}

};

module.exports = AsesoriaAdminModel;