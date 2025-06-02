// Ruta: backend/controllers/usuarioController.js
const db = require('../config/db');
const Usuario = require('../models/usuarioModel');



// Obtener datos de perfil del usuario autenticado
// backend/controllers/usuarioController.js

exports.obtenerPerfilPorId = (req, res) => {
  const userId = req.params.id;
  const query = `SELECT id, nombre_completo, correo, carrera, semestre, telefono, foto_perfil_url as avatar FROM usuarios WHERE id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error al obtener perfil:", err);
      return res.status(500).json({ mensaje: 'Error interno al obtener el perfil' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(results[0]);
  });
};

// Actualizar perfil (cuando esté habilitado en el frontend)
exports.actualizarPerfil = (req, res) => {
  const usuarioId = req.usuario?.id;
  if (!usuarioId) {
    return res.status(401).json({ mensaje: 'No autenticado.' });
  }

  const camposPermitidos = ['nombre_completo', 'correo', 'carrera', 'semestre', 'telefono'];
  const dataActualizacion = {};
  camposPermitidos.forEach(campo => {
    if (req.body[campo] !== undefined) {
      dataActualizacion[campo] = req.body[campo];
    }
  });

  if (Object.keys(dataActualizacion).length === 0) {
    return res.status(400).json({ mensaje: 'No se enviaron campos válidos para actualizar.' });
  }

  Usuario.update(usuarioId, dataActualizacion, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar perfil:", error);
      return res.status(500).json({ mensaje: 'Error al actualizar perfil.' });
    }

    res.json({ mensaje: 'Perfil actualizado correctamente.' });
  });
};

exports.actualizarPerfilUsuario = (req, res) => {
  const userId = req.params.id;
  const { nombre_completo, carrera, semestre, telefono } = req.body;

  const query = `
    UPDATE usuarios 
    SET nombre_completo = ?, carrera = ?, semestre = ?, telefono = ?
    WHERE id = ?
  `;

  db.query(query, [nombre_completo, carrera, semestre, telefono, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar perfil:", err);
      return res.status(500).json({ mensaje: 'Error al actualizar perfil.' });
    }
    res.json({ mensaje: 'Perfil actualizado correctamente.' });
  });
};

