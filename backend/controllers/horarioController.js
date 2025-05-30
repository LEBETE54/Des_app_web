// Ruta: backend/controllers/horarioController.js
const HorarioDisponible = require('../models/horarioDisponibleModel'); // Modelo corregido

exports.crearHorario = async (req, res) => {
    console.log("BACKEND: req.body recibido en crearHorario:", JSON.stringify(req.body, null, 2));

    if (!req.usuario || req.usuario.rol !== 'asesor') {
        return res.status(403).json({ mensaje: 'Acceso denegado. Solo los asesores pueden crear horarios.' });
    }

    const asesor_usuario_id = req.usuario.id;
    
    const { 
        titulo_asesoria, 
        descripcion_asesoria, 
        materia_id,
        fecha,             
        hora_inicio,       
        fechaFin,          
        hora_fin_form,     
        modalidad, 
        enlace_o_lugar, 
        max_estudiantes_simultaneos, 
        notas_adicionales  
    } = req.body;

    // Validar los campos que vienen del frontend
    if (!titulo_asesoria || !fecha || !hora_inicio || !fechaFin || !hora_fin_form) {
        return res.status(400).json({ 
            mensaje: 'Error: Faltan campos requeridos. Asegúrate de enviar: título, fecha de inicio, hora de inicio, fecha de fin y hora de fin.' 
        });
    }


    const fecha_hora_inicio_str = `${fecha} ${hora_inicio}:00`; 
    const fecha_hora_fin_str = `${fechaFin} ${hora_fin_form}:00`;

    if (new Date(fecha_hora_fin_str) <= new Date(fecha_hora_inicio_str)) {
        return res.status(400).json({ mensaje: 'La fecha/hora de fin debe ser posterior a la de inicio.' });
    }

    const nuevoHorarioParaBD = {
        asesor_usuario_id,
        titulo_asesoria,
        descripcion_asesoria: descripcion_asesoria || null,
        materia_id: materia_id ? parseInt(materia_id) : null,
        fecha_hora_inicio: fecha_hora_inicio_str, // Campo para la BD (DATETIME)
        fecha_hora_fin: fecha_hora_fin_str,       // Campo para la BD (DATETIME)
        modalidad: modalidad || 'virtual',
        enlace_o_lugar: enlace_o_lugar || null,
        estado_disponibilidad: 'disponible', 
        max_estudiantes_simultaneos: max_estudiantes_simultaneos ? parseInt(max_estudiantes_simultaneos) : 1,
        notas_adicionales: notas_adicionales || null 
    };

    HorarioDisponible.create(nuevoHorarioParaBD, (error, resultado) => {
        if (error) {
            console.error("Error al crear horario en BD:", error);
            return res.status(500).json({ mensaje: 'Error interno al guardar el periodo de asesoría.', detalle: error.message });
        }
        HorarioDisponible.findById(resultado.insertId, (err, horarioCreado) => {
            if(err || !horarioCreado || horarioCreado.length === 0) {
                 console.error("Error al recuperar el horario recién creado:", err);
                 return res.status(201).json({ 
                    mensaje: 'Periodo de asesoría creado (pero hubo un problema al recuperar sus detalles completos).', 
                    id: resultado.insertId, 
                    ...nuevoHorarioParaBD 
                });
            }
            res.status(201).json(horarioCreado[0]);
        });
    });
};

exports.obtenerMisHorarios = (req, res) => {
    if (!req.usuario) {
        return res.status(403).json({ mensaje: 'Acceso denegado. Solo para asesores.' });
    }
    // Esta función ahora usará el modelo corregido que ordena por fecha_hora_inicio
    HorarioDisponible.findByAsesorId(req.usuario.id, (error, horarios) => {
        if (error) {
            console.error("Error al obtener horarios del asesor:", error);
            return res.status(500).json({ mensaje: 'Error interno al obtener los horarios.', detalle: error.message });
        }
        res.json(horarios);
    });
};

exports.listarHorariosDisponiblesParaEstudiantes = (req, res) => {
    const filtros = req.query; 
    HorarioDisponible.findDisponiblesParaReserva(filtros, (error, horarios) => {
        if (error) {
            console.error("Error al obtener horarios disponibles para estudiantes:", error);
            return res.status(500).json({ mensaje: 'Error interno al buscar horarios disponibles.', detalle: error.message });
        }
        res.json(horarios);
    });
};

exports.obtenerHorarioPorId = (req, res) => {
    HorarioDisponible.findById(req.params.id, (error, horario) => {
        if (error) { return res.status(500).json({ mensaje: 'Error al obtener el horario.', detalle: error.message });}
        if (!horario || horario.length === 0) { return res.status(404).json({ mensaje: 'Horario no encontrado.' });}
        res.json(horario[0]);
    });
};

exports.actualizarHorario = (req, res) => {
    if (!req.usuario) {
        return res.status(403).json({ mensaje: 'Acceso denegado.' });
    }
    const horarioId = req.params.id;
    const asesorId = req.usuario.id;
    const dataToUpdate = req.body; 
    
    if (dataToUpdate.fecha && dataToUpdate.hora_inicio) {
        dataToUpdate.fecha_hora_inicio = `${dataToUpdate.fecha} ${dataToUpdate.hora_inicio}:00`;
        delete dataToUpdate.fecha;
        delete dataToUpdate.hora_inicio;
    }
    if (dataToUpdate.fechaFin && dataToUpdate.hora_fin_form) {
        dataToUpdate.fecha_hora_fin = `${dataToUpdate.fechaFin} ${dataToUpdate.hora_fin_form}:00`;
        delete dataToUpdate.fechaFin;
        delete dataToUpdate.hora_fin_form;
    }

    delete dataToUpdate.asesor_usuario_id; delete dataToUpdate.id; delete dataToUpdate.fecha_creacion;

    HorarioDisponible.update(horarioId, asesorId, dataToUpdate, (error, resultado) => {
        if (error) { return res.status(500).json({ mensaje: 'Error al actualizar el horario.', detalle: error.message });}
        if (resultado.affectedRows === 0) { return res.status(404).json({ mensaje: 'Horario no encontrado, no autorizado o sin cambios.' });}
        HorarioDisponible.findById(horarioId, (e, h) => res.json(e || !h || h.length === 0 ? {mensaje: 'Actualizado'} : h[0]));
    });
};

exports.eliminarHorario = (req, res) => {
     if (!req.usuario) {
        return res.status(403).json({ mensaje: 'Acceso denegado.' });
    }
    const horarioId = req.params.id;
    const asesorId = req.usuario.id; 
    HorarioDisponible.findById(horarioId, (errFind, horarios) => {
        if (errFind) return res.status(500).json({ mensaje: "Error verificando horario", detalle: errFind.message });
        if (!horarios || horarios.length === 0) return res.status(404).json({ mensaje: "Horario no encontrado" });
        if (horarios[0].asesor_usuario_id !== asesorId) {
            return res.status(403).json({ mensaje: "No autorizado para eliminar este horario." });
        }
        if (horarios[0].estado_disponibilidad === 'reservado') {
            return res.status(400).json({ mensaje: "No se puede eliminar un horario que ya está reservado. Considere cancelarlo." });
        }
        HorarioDisponible.delete(horarioId, asesorId, (error, resultado) => {
            if (error) { return res.status(500).json({ mensaje: 'Error al eliminar el horario.', detalle: error.message });}
            if (resultado.affectedRows === 0) { return res.status(404).json({ mensaje: 'Horario no encontrado o no se pudo eliminar.' });}
            res.json({ mensaje: 'Horario eliminado exitosamente.', id: horarioId });
        });
    });
};
