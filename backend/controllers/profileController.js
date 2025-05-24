const db = require('../models/db');

exports.updateProfile = async (req, res) => {
  const { carrera, semestre, especialidad, habilidades } = req.body;
  const userId = req.user.id;

  try {
    // 1. Actualizar datos principales con manejo seguro de archivos
    const fotoPath = req.files?.foto?.[0]?.path || null;
    
    await db.query(
      `UPDATE usuarios 
       SET carrera = ?, 
           semestre = ?, 
           especialidad = ?,
           foto_perfil = COALESCE(?, foto_perfil)
       WHERE id = ?`,
      [carrera, semestre, especialidad, fotoPath, userId]
    );

    // 2. Manejar habilidades con transacción
    await db.query('START TRANSACTION');
    
    await db.query('DELETE FROM habilidades WHERE usuario_id = ?', [userId]);
    
    if (habilidades && JSON.parse(habilidades).length > 0) {
      const insertHabilidades = JSON.parse(habilidades).map(habilidad => 
        [userId, habilidad]
      );
      
      await db.query(
        'INSERT INTO habilidades (usuario_id, habilidad) VALUES ?',
        [insertHabilidades]
      );
    }

    // 3. Manejar certificados con validación
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

    await db.query('COMMIT');
    
    // 4. Respuesta mejorada para el frontend
    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      redirect: '/dashboard',
      foto_perfil: fotoPath
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error al actualizar perfil:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error en el servidor',
      errorDetails: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};