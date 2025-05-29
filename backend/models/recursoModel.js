// Ruta: backend/models/recursoModel.js
const db = require('../config/db');

const Recurso = {
    create: (data, callback) => {
        // Campos esperados: usuario_id_autor, materia_id_relacionada (opcional), titulo, descripcion, enlace_url, tipo_recurso, archivo_adjunto_url
        const query = 'INSERT INTO recursos SET ?';
        db.query(query, data, callback);
    },

    // Obtener todos los recursos (podríamos filtrar por públicos, o por materia más adelante)
    getAllPublic: (callback) => {
        // Unir con usuario para obtener nombre del autor y materia para el nombre de la materia
        const query = `
            SELECT 
                r.*, 
                u.nombre_completo as nombre_autor,
                m.nombre as nombre_materia
            FROM recursos r
            JOIN usuarios u ON r.usuario_id_autor = u.id
            LEFT JOIN materias m ON r.materia_id_relacionada = m.id
            WHERE r.es_publico = TRUE  /* Asumiendo que tienes un campo es_publico */
            ORDER BY r.fecha_publicacion DESC
        `;
        // Si no tienes `es_publico`, ajusta la query o quita el WHERE
        db.query(query, callback);
    },

    // Obtener recursos de un asesor específico
    findByAsesorId: (asesorId, callback) => {
        const query = `
            SELECT 
                r.*,
                m.nombre as nombre_materia
            FROM recursos r
            LEFT JOIN materias m ON r.materia_id_relacionada = m.id
            WHERE r.usuario_id_autor = ?
            ORDER BY r.fecha_publicacion DESC
        `;
        db.query(query, [asesorId], callback);
    },

    findById: (id, callback) => {
        const query = `
            SELECT 
                r.*, 
                u.nombre_completo as nombre_autor,
                m.nombre as nombre_materia
            FROM recursos r
            JOIN usuarios u ON r.usuario_id_autor = u.id
            LEFT JOIN materias m ON r.materia_id_relacionada = m.id
            WHERE r.id = ?
        `;
        db.query(query, [id], callback);
    },

    delete: (id, usuarioIdAutor, callback) => {
        // Solo permitir borrar si el usuario es el autor del recurso
        const query = 'DELETE FROM recursos WHERE id = ? AND usuario_id_autor = ?';
        db.query(query, [id, usuarioIdAutor], callback);
    }
    // Faltaría update si lo necesitas
};

module.exports = Recurso;
