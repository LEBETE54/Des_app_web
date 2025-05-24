// GET todos los recursos
router.get('/recursos', async (req, res) => {
  try {
    const [recursos] = await db.query('SELECT * FROM recursos');
    res.json(recursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener recursos' });
  }
});

// POST nuevo recurso
router.post('/recursos', async (req, res) => {
  try {
    const { titulo, descripcion, enlace, tipo } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO recursos (titulo, descripcion, enlace, tipo) VALUES (?, ?, ?, ?)',
      [titulo, descripcion, enlace, tipo]
    );
    
    const [newRecurso] = await db.query('SELECT * FROM recursos WHERE id = ?', [result.insertId]);
    res.status(201).json(newRecurso[0]);
    
  } catch (error) {
    res.status(500).json({ message: 'Error al crear recurso' });
  }
});

// DELETE recurso
router.delete('/recursos/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM recursos WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar recurso' });
  }
});