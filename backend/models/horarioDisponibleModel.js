// Ruta: backend/models/horarioDisponibleModel.js
const db = require('../config/db'); 

const HorarioDisponible = {
    create: (data, callback) => {
        const query = 'INSERT INTO horarios_disponibles_asesor SET ?';
        db.query(query, data, callback);
    },

    findByAsesorId: (asesorUsuarioId, callback) => {
        // CORREGIDO: Ordenar por fecha_hora_inicio
        const query = `
            SELECT 
                hda.*,  /* Selecciona todas las columnas de horarios_disponibles_asesor */
                m.nombre as nombre_materia,
                (SELECT COUNT(*) FROM reservas_estudiantes re WHERE re.horario_disponibilidad_id = hda.id AND re.estado_reserva NOT IN ('cancelada_estudiante', 'cancelada_asesor')) as inscritos_count
            FROM horarios_disponibles_asesor hda 
            LEFT JOIN materias m ON hda.materia_id = m.id 
            WHERE hda.asesor_usuario_id = ? 
            ORDER BY hda.fecha_hora_inicio DESC`; // <--- USA LA COLUMNA CORRECTA: fecha_hora_inicio
        db.query(query, [asesorUsuarioId], callback);
    },

    findById: (id, callback) => {
        const query = `
            SELECT 
                hda.*, 
                m.nombre as nombre_materia,
                u.nombre_completo as nombre_asesor, u.correo as correo_asesor, u.foto_perfil_url as foto_asesor,
                ad.descripcion_corta as asesor_descripcion_corta, ad.tarifa_descripcion as asesor_tarifa,
                (SELECT COUNT(*) FROM reservas_estudiantes re WHERE re.horario_disponibilidad_id = hda.id AND re.estado_reserva NOT IN ('cancelada_estudiante', 'cancelada_asesor')) as inscritos_count
            FROM horarios_disponibles_asesor hda
            JOIN usuarios u ON hda.asesor_usuario_id = u.id
            LEFT JOIN asesor_detalles ad ON u.id = ad.usuario_id
            LEFT JOIN materias m ON hda.materia_id = m.id 
            WHERE hda.id = ?`;
        db.query(query, [id], callback);
    },

    update: (id, asesorUsuarioId, data, callback) => {
        const query = 'UPDATE horarios_disponibles_asesor SET ? WHERE id = ? AND asesor_usuario_id = ?';
        db.query(query, [data, id, asesorUsuarioId], callback);
    },

    delete: (id, asesorUsuarioId, callback) => {
        const query = 'DELETE FROM horarios_disponibles_asesor WHERE id = ? AND asesor_usuario_id = ?';
        db.query(query, [id, asesorUsuarioId], callback);
    },

    findDisponiblesParaReserva: (filtros, callback) => {
        // CORREGIDO: Usar fecha_hora_fin y fecha_hora_inicio
        let query = `
            SELECT 
                hda.id, hda.titulo_asesoria, hda.descripcion_asesoria, 
                hda.fecha_hora_inicio, /* Usar nombre correcto */
                hda.fecha_hora_fin,    /* Usar nombre correcto */
                hda.modalidad, hda.enlace_o_lugar, hda.notas_adicionales, hda.max_estudiantes_simultaneos,
                hda.estado_disponibilidad,
                hda.asesor_usuario_id,  
                u.id as asesor_id, u.nombre_completo as nombre_asesor, u.correo as correo_asesor, u.foto_perfil_url as foto_asesor,
                ad.descripcion_corta as asesor_descripcion_corta, ad.tarifa_descripcion as asesor_tarifa,
                m.nombre as nombre_materia, m.id as materia_id_slot,
                (SELECT COUNT(*) FROM reservas_estudiantes re WHERE re.horario_disponibilidad_id = hda.id AND re.estado_reserva NOT IN ('cancelada_estudiante', 'cancelada_asesor')) as inscritos_count
            FROM horarios_disponibles_asesor hda
            JOIN usuarios u ON hda.asesor_usuario_id = u.id
            LEFT JOIN asesor_detalles ad ON u.id = ad.usuario_id
            LEFT JOIN materias m ON hda.materia_id = m.id
            WHERE hda.estado_disponibilidad = 'disponible' 
              AND hda.fecha_hora_fin > NOW() 
              AND (hda.max_estudiantes_simultaneos IS NULL OR 
                  (SELECT COUNT(*) FROM reservas_estudiantes re WHERE re.horario_disponibilidad_id = hda.id AND re.estado_reserva NOT IN ('cancelada_estudiante', 'cancelada_asesor')) < hda.max_estudiantes_simultaneos)
        `;
        const params = [];

        if (filtros && filtros.materia_id) {
            query += ' AND (hda.materia_id = ? OR hda.materia_id IS NULL)';
            params.push(filtros.materia_id);
        }
        if (filtros && filtros.fecha_especifica) {
             query += ' AND DATE(hda.fecha_hora_inicio) <= ? AND DATE(hda.fecha_hora_fin) >= ?';
             params.push(filtros.fecha_especifica, filtros.fecha_especifica);
        }
        
        query += ' ORDER BY hda.fecha_hora_inicio ASC'; // Usar fecha_hora_inicio
        db.query(query, params, callback);
    }
};

module.exports = HorarioDisponible;
