exports.setupProfile = async (req, res) => {
  const userId = req.user.id;
  const { carrera, semestre, especialidad, habilidades } = req.body;

  try {
    // 1. Validar campos requeridos
    if (!carrera || !semestre) {
      return res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
    }

    // 2. Manejar foto de perfil
    const fotoPath = req.files?.foto?.[0]?.path || null;

    // 3. Actualizar usuario
    const [updateResult] = await db.query(
      `UPDATE usuarios SET 
        carrera = ?, 
        semestre = ?, 
        especialidad = ?,
        foto_perfil = ?
      WHERE id = ?`,
      [carrera, semestre, especialidad, fotoPath, userId]
    );

    // 4. Insertar habilidades
    if (habilidades && habilidades.length > 0) {
      const habilidadesArray = JSON.parse(habilidades);
      const values = habilidadesArray.map(habilidad => [userId, habilidad]);
      
      await db.query(
        'INSERT INTO habilidades (usuario_id, habilidad) VALUES ?',
        [values]
      );
    }

    // 5. Insertar certificados
    if (req.files?.certificado) {
      const certificadosData = req.files.certificado.map(cert => ({
        usuario_id: userId,
        nombre: cert.originalname,
        archivo: cert.path,
        fecha: new Date()
      }));
      
      await db.query(
        `INSERT INTO certificados (usuario_id, nombre, archivo, fecha) VALUES ?`,
        [certificadosData.map(c => [c.usuario_id, c.nombre, c.archivo, c.fecha])]
      );
    }

    res.status(200).json({ 
      success: true,
      redirect: '/dashboard'
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor: ' + error.message
    });
  }
};