const db = require('../config/db'); 

const Usuario = {

  findById: (id, callback) => {
    const query = `
      SELECT id, nombre_completo, correo, carrera, semestre, telefono, foto_perfil_url AS avatar
      FROM usuarios
      WHERE id = ?
    `;
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null); // Usuario no encontrado
      callback(null, results[0]);
    });
  },

  update: (id, data, callback) => {
    const { nombre_completo, carrera, semestre, telefono, foto_perfil_url } = data;
    const query = `
      UPDATE usuarios
      SET nombre_completo = ?, carrera = ?, semestre = ?, telefono = ?, foto_perfil_url = ?
      WHERE id = ?
    `;
    db.query(query, [nombre_completo, carrera, semestre, telefono, foto_perfil_url || null, id], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }

};

module.exports = Usuario;
