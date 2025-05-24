const db = require('../models/db');

exports.updateProfile = async (req, res) => {
  const { carrera, semestre, especialidad, habilidades } = req.body;
  const userId = req.user.id;

  try {
    // 1. Actualizar datos principales
    const fotoPath = req.files?.foto?.[0]?.path || null;
    
    await db.query(
      `UPDATE usuarios 
       SET carrera = ?, 
           semestre = ?, 
           especialidad = ?,
           foto_perfil = COALESCE(?, foto_perfil)
       WHERE id = ?`,
      [carrera || null, semestre || null, especialidad || null, fotoPath, userId]
    );

    // 2. Manejar habilidades
    await db.query('DELETE FROM habilidades WHERE usuario_id = ?', [userId]);
    
    if (habilidades && JSON.parse(habilidades).length > 0) {
      const habilidadesArray = JSON.parse(habilidades);
      const values = habilidadesArray.map(habilidad => [userId, habilidad]);
      
      await db.query(
        'INSERT INTO habilidades (usuario_id, habilidad) VALUES ?',
        [values]
      );
    }

    // 3. Respuesta exitosa
    res.status(200).json({
      success: true,
      redirect: '/dashboard',
      user: {
        carrera,
        semestre,
        especialidad,
        foto_perfil: fotoPath
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor: ' + error.message
    });
  }
};