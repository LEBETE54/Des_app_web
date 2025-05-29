const db = require('../config/db');

const Asesoria = {
  getAll: (callback) => {
    db.query('SELECT * FROM asesorias', callback);
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
