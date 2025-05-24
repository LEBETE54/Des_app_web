const db = require('../models/db');

exports.setupProfile = async (req, res) => {
  const { carrera, semestre, especialidad, habilidades } = req.body;
  const userId = req.user.id;

  try {
    // 1. Actualizar usuario
    await db.query(
      `UPDATE usuarios SET 
        carrera = ?, 
        semestre = ?, 
        especialidad = ?,
        foto_perfil = ?
      WHERE id = ?`,
      [
        carrera,
        semestre,
        especialidad,
        req.files?.foto?.[0]?.path || null,
        userId
      ]
    );

    // 2. Insertar habilidades
    if (habilidades) {
      const habilidadesArray = JSON.parse(habilidades);
      const values = habilidadesArray.map(habilidad => [userId, habilidad]);
      
      await db.query(
        'INSERT INTO habilidades (usuario_id, habilidad) VALUES ?',
        [values]
      );
    }

    // 3. Insertar certificados (opcional)
    if (req.files?.certificado) {
      const certificadosData = req.files.certificado.map(cert => ({
        usuario_id: userId,
        nombre: cert.originalname,
        archivo: cert.path,
        fecha: new Date()
      }));
      
      await db.query(
        `INSERT INTO certificados 
          (usuario_id, nombre, archivo, fecha)
         VALUES ?`,
        [certificadosData.map(c => [c.usuario_id, c.nombre, c.archivo, c.fecha])]
      );
    }

    res.status(201).json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor: ' + error.message 
    });
  }
};