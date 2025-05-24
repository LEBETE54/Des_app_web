const db = require('../models/db');

exports.updateProfile = async (req, res) => {
  const { carrera, semestre, especialidad } = req.body;
  const userId = req.user.id; // Asumiendo que tienes middleware de autenticación

  try {
    // Actualizar datos principales
    await db.query(
      'UPDATE usuarios SET carrera = ?, semestre = ?, especialidad = ?, foto_perfil = ? WHERE id = ?',
      [carrera, semestre, especialidad, req.files?.foto?.[0]?.path, userId]
    );

    // Manejar habilidades
    if (req.body.habilidades) {
      const habilidades = JSON.parse(req.body.habilidades);
      await db.query('DELETE FROM habilidades WHERE usuario_id = ?', [userId]);
      for (const habilidad of habilidades) {
        await db.query(
          'INSERT INTO habilidades (usuario_id, habilidad) VALUES (?, ?)',
          [userId, habilidad]
        );
      }
    }

    // Manejar certificados
    if (req.files.certificado) {
      for (const cert of req.files.certificado) {
        await db.query(
          'INSERT INTO certificados (usuario_id, nombre, archivo, fecha) VALUES (?, ?, ?, ?)',
          [userId, cert.originalname, cert.path, new Date()]
        );
      }
    }

    res.status(200).json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};