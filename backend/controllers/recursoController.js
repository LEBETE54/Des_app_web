// Ruta: backend/controllers/recursoController.js
const Recurso = require('../models/recursoModel');
const path = require('path'); // Módulo de Node para trabajar con rutas de archivos

// No necesitamos multer aquí directamente si se configura en las rutas

exports.crearRecurso = async (req, res) => {
    if (!req.usuario || req.usuario.rol !== 'asesor') {
        return res.status(403).json({ mensaje: 'Acceso denegado. Solo los asesores pueden crear recursos.' });
    }

    const { titulo, descripcion, enlace_url, tipo_recurso, materia_id_relacionada } = req.body;
    const usuario_id_autor = req.usuario.id;

    if (!titulo || !tipo_recurso) {
        return res.status(400).json({ mensaje: 'Título y tipo de recurso son requeridos.' });
    }

    let archivo_adjunto_url = null;

    // req.file es añadido por multer si se sube un archivo con el nombre 'archivoRecurso'
    if (req.file) {
        // Guardamos la ruta relativa para acceder al archivo desde el frontend/API
        // Ej: /uploads/recursos/nombrearchivo123.pdf
        archivo_adjunto_url = `/uploads/recursos/${req.file.filename}`;
    } else if (tipo_recurso === 'documento_pdf' || tipo_recurso === 'imagen') {
        // Si el tipo es PDF o imagen pero no se subió archivo, podría ser un error
        // o podrías permitirlo si el enlace_url apunta a un PDF/imagen externo.
        // Por ahora, si es PDF/imagen y no hay archivo, y no hay enlace_url, es un problema.
        if (!enlace_url) {
             // return res.status(400).json({ mensaje: 'Para tipo PDF o Imagen, se requiere un archivo o un enlace.' });
             // Decidimos permitir PDF/Imagen sin archivo si hay enlace_url
        }
    }


    if ((tipo_recurso === 'video' || tipo_recurso === 'articulo_web') && !enlace_url) {
        return res.status(400).json({ mensaje: 'Para tipo Video o Artículo Web, se requiere un enlace.' });
    }


    const nuevoRecurso = {
        usuario_id_autor,
        titulo,
        descripcion: descripcion || null,
        enlace_url: enlace_url || null,
        tipo_recurso,
        archivo_adjunto_url, // Será null si no se subió archivo
        materia_id_relacionada: materia_id_relacionada ? parseInt(materia_id_relacionada) : null,
        es_publico: true, // Por defecto los recursos son públicos, puedes cambiarlo
        // fecha_publicacion se establece por defecto en la BD
    };

    Recurso.create(nuevoRecurso, (error, resultado) => {
        if (error) {
            console.error("Error al crear recurso:", error);
            return res.status(500).json({ mensaje: 'Error interno al crear el recurso.', detalle: error.message });
        }
        // Devolvemos el recurso completo, incluyendo el ID y la ruta del archivo si existe
        Recurso.findById(resultado.insertId, (err, recursoCreado) => {
            if(err || !recursoCreado || recursoCreado.length === 0) {
                 return res.status(201).json({ mensaje: 'Recurso creado exitosamente (detalle no recuperado).', id: resultado.insertId });
            }
            res.status(201).json(recursoCreado[0]);
        });
    });
};

exports.listarRecursosPublicos = (req, res) => {
    // Aquí podrías añadir filtros desde req.query si es necesario (ej. por materia)
    Recurso.getAllPublic((error, recursos) => {
        if (error) {
            console.error("Error al obtener recursos públicos:", error);
            return res.status(500).json({ mensaje: 'Error interno al obtener los recursos.', detalle: error.message });
        }
        res.json(recursos);
    });
};

exports.listarMisRecursos = (req, res) => {
    if (!req.usuario) { // Solo usuarios logueados
        return res.status(401).json({ mensaje: 'Acceso denegado.' });
    }
    const asesorId = req.usuario.id; // Asume que el usuario es el asesor
                                    // O si un admin puede ver, necesitarías lógica adicional

    Recurso.findByAsesorId(asesorId, (error, recursos) => {
        if (error) {
            console.error("Error al obtener mis recursos:", error);
            return res.status(500).json({ mensaje: 'Error interno al obtener tus recursos.', detalle: error.message });
        }
        res.json(recursos);
    });
};


exports.eliminarRecurso = (req, res) => {
    if (!req.usuario || req.usuario.rol !== 'asesor') { // Solo asesores pueden borrar
        return res.status(403).json({ mensaje: 'Acceso denegado.' });
    }
    const recursoId = req.params.id;
    const usuarioIdAutor = req.usuario.id;

    // Aquí también deberías borrar el archivo físico del servidor si existe en archivo_adjunto_url
    // fs.unlink(path.join(__dirname, '../..', recurso.archivo_adjunto_url) , (err) => ...);

    Recurso.delete(recursoId, usuarioIdAutor, (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al eliminar el recurso.', detalle: error.message });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Recurso no encontrado o no tienes permiso para eliminarlo.' });
        }
        res.json({ mensaje: 'Recurso eliminado exitosamente.', id: recursoId });
    });
};
