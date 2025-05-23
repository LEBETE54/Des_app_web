const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const query = 'INSERT INTO usuarios (nombre, correo, contrasenia) VALUES (?, ?, ?)';
    db.query(query, [nombre, correo, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ message: 'Error al registrar usuario' });
      }
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.login = (req, res) => {
  const { correo, contrasenia } = req.body; // Cambiado a "contrasenia"

  const query = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(query, [correo], async (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = results[0];
    
    try {
      // Corregido a "contrasenia" (nombre de columna en la BD)
      const isMatch = await bcrypt.compare(contrasenia, user.contrasenia);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      res.status(200).json({ 
        message: 'Autenticación exitosa', 
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          correo: user.correo
        }
      });
      
    } catch (error) {
      console.error('Error al comparar contraseñas:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });
};