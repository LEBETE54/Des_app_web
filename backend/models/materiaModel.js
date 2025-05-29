// Ruta: backend/models/materiaModel.js
const db = require('../config/db'); // Asegúrate que la ruta a tu config de BD (db.js) sea correcta

const Materia = {
    /**
     * Obtiene todas las materias de la base de datos, ordenadas por nombre.
     * @param {function(Error|null, Array<Object>|null)} callback - Función a ejecutar con el resultado.
     */
    getAll: (callback) => {
        const query = 'SELECT * FROM materias ORDER BY nombre ASC';
        db.query(query, callback);
    },

    /**
     * Busca una materia por su ID.
     * @param {number} id - El ID de la materia a buscar.
     * @param {function(Error|null, Object|null)} callback - Función a ejecutar con el resultado.
     */
    findById: (id, callback) => {
        const query = 'SELECT * FROM materias WHERE id = ?';
        db.query(query, [id], callback);
    },

    /**
     * Crea una nueva materia en la base de datos.
     * @param {Object} data - Objeto con los datos de la materia (ej. { nombre, descripcion, area_conocimiento_padre }).
     * @param {function(Error|null, Object|null)} callback - Función a ejecutar con el resultado de la inserción.
     */
    create: (data, callback) => {
        const query = 'INSERT INTO materias SET ?';
        db.query(query, data, callback);
    },

    /**
     * Actualiza una materia existente por su ID.
     * @param {number} id - El ID de la materia a actualizar.
     * @param {Object} data - Objeto con los nuevos datos de la materia.
     * @param {function(Error|null, Object|null)} callback - Función a ejecutar con el resultado de la actualización.
     */
    update: (id, data, callback) => {
        const query = 'UPDATE materias SET ? WHERE id = ?';
        db.query(query, [data, id], callback);
    },

    /**
     * Elimina una materia por su ID.
     * @param {number} id - El ID de la materia a eliminar.
     * @param {function(Error|null, Object|null)} callback - Función a ejecutar con el resultado de la eliminación.
     */
    delete: (id, callback) => {
        // Considera la lógica de ON DELETE si hay claves foráneas apuntando a materias
        // (ej. en asesor_materias, horarios_disponibles_asesor, etc.)
        const query = 'DELETE FROM materias WHERE id = ?';
        db.query(query, [id], callback);
    }
    // Puedes añadir más funciones específicas si las necesitas en el futuro.
};

module.exports = Materia;
