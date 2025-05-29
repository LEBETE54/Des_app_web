const db = require('../config/db');

const Recurso = {
    create: (data, callback) => {
        const query = 'INSERT INTO recursos SET ?';
        db.query(query, data, callback);
    },

    getAllPublic: (callback) => {
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
        db.query(query, callback);
    },

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
        const query = 'DELETE FROM recursos WHERE id = ? AND usuario_id_autor = ?';
        db.query(query, [id, usuarioIdAutor], callback);
    }
};

module.exports = Recurso;
