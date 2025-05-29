const db = require('../config/db');

const Asesoria = {
  getAll: (callback) => {
db.query(`
  SELECT 
    id,
    titulo_asesoria,
    fecha_hora_inicio,
    fecha_hora_fin
  FROM horarios_disponibles_asesor
`, callback);

  },
  create: (data, callback) => {
    db.query('INSERT INTO asesorias SET ?', data, callback);
  },
  update: (id, data, callback) => {
    db.query('UPDATE asesorias SET ? WHERE id = ?', [data, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM asesorias WHERE id = ?', [id], callback);
  }
};

module.exports = Asesoria;
