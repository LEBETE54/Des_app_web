const db = require('../config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    const { nombre_completo, correo, contrasenia, rol, carrera, semestre, telefono } = req.body;

    // Validación básica de campos
    if (!nombre_completo || !correo || !contrasenia) {
        return res.status(400).json({ mensaje: 'Nombre completo, correo y contraseña son requeridos.' });
    }

    const rolesPermitidos = ['estudiante', 'asesor', 'admin'];
    if (rol && !rolesPermitidos.includes(rol)) {
        return res.status(400).json({ mensaje: 'El rol proporcionado no es válido.' });
    }

    try {
        const [usuariosExistentes] = await db.promise().query('SELECT correo FROM usuarios WHERE correo = ?', [correo]);

        if (usuariosExistentes.length > 0) {
            return res.status(409).json({ mensaje: 'El correo electrónico ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const contraseniaHasheada = await bcrypt.hash(contrasenia, salt);

        const nuevoUsuario = {
            nombre_completo,
            correo,
            contrasenia: contraseniaHasheada,
            rol: rol || 'estudiante', 
            carrera: carrera || null,
            semestre: semestre || null,
            telefono: telefono || null,
            activo: true, 
        };

        const [resultado] = await db.promise().query('INSERT INTO usuarios SET ?', nuevoUsuario);
        const nuevoUsuarioId = resultado.insertId;

        const payload = {
            usuario: {
                id: nuevoUsuarioId,
                rol: nuevoUsuario.rol,
                correo: nuevoUsuario.correo
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }, 
            (error, token) => {
                if (error) throw error;
                res.status(201).json({
                    mensaje: 'Usuario registrado exitosamente.',
                    token,
                    usuario: {
                        id: nuevoUsuarioId,
                        nombre_completo: nuevoUsuario.nombre_completo,
                        correo: nuevoUsuario.correo,
                        rol: nuevoUsuario.rol
                    }
                });
            }
        );

    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor al intentar registrar el usuario.', detalle: error.message });
    }
};

// Iniciar sesión de un usuario existente
exports.login = async (req, res) => {
    const { correo, contrasenia } = req.body;

    if (!correo || !contrasenia) {
        return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos.' });
    }

    try {
        const [usuarios] = await db.promise().query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

        if (usuarios.length === 0) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas (usuario no encontrado).' });
        }

        const usuario = usuarios[0];

        if (!usuario.activo) {
            return res.status(403).json({ mensaje: 'Esta cuenta ha sido desactivada. Contacta al administrador.' });
        }

        const esMatch = await bcrypt.compare(contrasenia, usuario.contrasenia);

        if (!esMatch) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas (contraseña incorrecta).' });
        }

        const payload = {
            usuario: {
                id: usuario.id,
                rol: usuario.rol,
                correo: usuario.correo
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (error, token) => {
                if (error) throw error;
                res.json({
                    mensaje: 'Inicio de sesión exitoso.',
                    token,
                    usuario: {
                        id: usuario.id,
                        nombre_completo: usuario.nombre_completo,
                        correo: usuario.correo,
                        rol: usuario.rol,
                      
                    }
                });
            }
        );

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor al intentar iniciar sesión.', detalle: error.message });
    }
};