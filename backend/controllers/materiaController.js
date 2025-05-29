const Materia = require('../models/materiaModel'); // Importa el modelo


exports.listarTodasLasMaterias = (req, res) => {
    Materia.getAll((error, materias) => {
        if (error) {
            console.error("Error al obtener materias desde el controlador:", error);
            return res.status(500).json({ 
                mensaje: 'Error interno del servidor al obtener las materias.', 
                detalle: error.message 
            });
        }
        res.status(200).json(materias);
    });
};


exports.crearMateria = (req, res) => {

    const { nombre, descripcion, area_conocimiento_padre } = req.body;

    if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre de la materia es requerido.' });
    }

    const nuevaMateria = { nombre, descripcion, area_conocimiento_padre };

    Materia.create(nuevaMateria, (error, resultado) => {
        if (error) {
            console.error("Error al crear materia:", error);
            // Manejar error de duplicado (UNIQUE en 'nombre')
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ mensaje: 'Error al crear la materia: el nombre ya existe.', detalle: error.message });
            }
            return res.status(500).json({ mensaje: 'Error interno al crear la materia.', detalle: error.message });
        }
        res.status(201).json({ mensaje: 'Materia creada exitosamente.', id: resultado.insertId, ...nuevaMateria });
    });
};

