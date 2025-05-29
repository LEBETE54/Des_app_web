const db = require('../config/db'); 

const Materia = {
    /**
     * @param {function(Error|null, Array<Object>|null)} callback 
     */
    getAll: (callback) => {
        const query = 'SELECT * FROM materias ORDER BY nombre ASC';
        db.query(query, callback);
    },

    /**
     * @param {number} id - El ID de la materia a buscar.
     * @param {function(Error|null, Object|null)} callback - Función a ejecutar con el resultado.
     */
    findById: (id, callback) => {
        const query = 'SELECT * FROM materias WHERE id = ?';
        db.query(query, [id], callback);
    },

    /**
     * @param {Object} data 
     * @param {function(Error|null, Object|null)} callback - Función a ejecutar con el resultado de la inserción.
     */
    create: (data, callback) => {
        const query = 'INSERT INTO materias SET ?';
        db.query(query, data, callback);
    },

    /**
     * @param {number} id 
     * @param {Object} data 
     * @param {function(Error|null, Object|null)} callback - Función a ejecutar con el resultado de la actualización.
     */
    update: (id, data, callback) => {
        const query = 'UPDATE materias SET ? WHERE id = ?';
        db.query(query, [data, id], callback);
    },

    /**
     * @param {number} id 
     * @param {function(Error|null, Object|null)} callback - Función a ejecutar con el resultado de la eliminación.
     */
    delete: (id, callback) => {
        
        const query = 'DELETE FROM materias WHERE id = ?';
        db.query(query, [id], callback);
    }
};

module.exports = Materia;
