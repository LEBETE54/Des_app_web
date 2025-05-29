// Ruta: backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para acceder a process.env.JWT_SECRET

module.exports = function(req, res, next) {
    // Obtener token del header 'x-auth-token'
    const token = req.header('x-auth-token');

    // Verificar si no hay token
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
    }

    // Verificar y decodificar el token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // El payload que guardamos en el token era { usuario: { id, rol, correo } }
        // Añadimos el objeto 'usuario' del payload a la solicitud (req)
        req.usuario = decoded.usuario; 
        
        // console.log('[AuthMiddleware] Token verificado, usuario:', req.usuario); // Para depuración
        next(); // Pasa al siguiente middleware o al controlador de la ruta
    } catch (error) {
        console.error("[AuthMiddleware] Error al verificar token:", error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ mensaje: 'Token no es válido (formato incorrecto o firma inválida).' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensaje: 'Token ha expirado. Por favor, inicia sesión de nuevo.' });
        }
        // Otro tipo de error
        return res.status(500).json({ mensaje: 'Error del servidor al validar el token.' });
    }
};
