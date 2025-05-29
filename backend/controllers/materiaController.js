// Ruta: backend/controllers/materiaController.js
const Materia = require('../models/materiaModel'); // Importa el modelo

/**
 * Controlador para listar todas las materias.
 * Usado principalmente para poblar dropdowns en el frontend.
 */
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

/**
 * Controlador para crear una nueva materia.
 * (Opcional - Podría ser solo para administradores)
 */
exports.crearMateria = (req, res) => {
    // Aquí deberías añadir validación del rol del usuario (si es solo para admin)
    // if (req.usuario.rol !== 'admin') {
    //     return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores pueden crear materias.' });
    // }

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

// Puedes añadir más controladores para obtener por ID, actualizar y eliminar materias
// si necesitas una gestión completa de materias desde el API (probablemente para un panel de admin).
// exports.obtenerMateriaPorId = (req, res) => { ... };
// exports.actualizarMateria = (req, res) => { ... };
// exports.eliminarMateria = (req, res) => { ... };
    