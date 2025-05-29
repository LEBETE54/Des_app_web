const jwt = require('jsonwebtoken');
require('dotenv').config(); 

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        req.usuario = decoded.usuario; 
        
        next(); 
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
