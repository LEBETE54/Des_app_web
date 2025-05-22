const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  const hash = await bcrypt.hash(contraseña, 10);

  const sql = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)';
  db.query(sql, [nombre, correo, hash], (err) => {
    if (err) return res.status(500).json({ message: 'Error al registrar' });
    return res.status(200).json({ message: 'Registro exitoso' });
  });
});

router.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const usuario = results[0];
    const match = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login exitoso', token });
  });
});

module.exports = router;
