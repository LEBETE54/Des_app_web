import React, { useEffect, useState, useCallback } from 'react';
import useAuthStore from '../store/authStore'; 
import horarioService from '../services/horarioService'; 
import materiaService from '../services/materiaService'; 
import '../styles/components/CrearAsesoria.css'; 

const CrearAsesoria = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const currentUser = useAuthStore(state => state.user);
    const esAsesor = isAuthenticated && currentUser?.rol === 'asesor';

    const [mostrarForm, setMostrarForm] = useState(false);
    const [asesorias, setAsesorias] = useState([]); 

    // Estado del formulario para definir un periodo de asesoría
    const [form, setForm] = useState({
        titulo_asesoria: '',       
        descripcion_asesoria: '',  
        materia_id: '',            
        fechaInicio: '',          
        horaInicio: '09:00',       
        fechaFin: '',            
        horaFin: '17:00',         
        modalidad: 'virtual',      
        enlace_o_lugar: '',        
        max_estudiantes_simultaneos: 1, 
        notas_adicionales: ''      
    });
    const [editandoId, setEditandoId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [materias, setMaterias] = useState([]);

    const fetchMisPeriodos = useCallback(async () => {
        if (!esAsesor) {
            setAsesorias([]);
            return;
        }
        setIsLoading(true); setError(null);
        try {
          
            const res = await horarioService.obtenerMisHorarios(); 
            setAsesorias((res || []).sort((a,b) => new Date(b.fecha_hora_inicio) - new Date(a.fecha_hora_inicio)));
        } catch (err) {
            setError(err.mensaje || 'Error al cargar mis periodos de asesoría.');
            console.error("Error en obtenerMisHorarios:", err);
        }
        setIsLoading(false);
    }, [esAsesor]);

    const fetchMaterias = useCallback(async () => {
        try {
            const res = await materiaService.obtenerTodasLasMaterias();
            setMaterias(res || []);
        } catch (err) {
            console.error("Error al cargar materias:", err);
        }
    }, []);


    useEffect(() => {
        if (esAsesor) {
            fetchMaterias();
            fetchMisPeriodos();
        }
    }, [esAsesor, fetchMaterias, fetchMisPeriodos]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setForm({
            titulo_asesoria: '', descripcion_asesoria: '', materia_id: '',
            fechaInicio: '', horaInicio: '09:00',
            fechaFin: '', horaFin: '17:00',
            modalidad: 'virtual', enlace_o_lugar: '',
            max_estudiantes_simultaneos: 1, notas_adicionales: ''
        });
        setEditandoId(null);
        setMostrarForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); setSuccessMessage(null); setIsLoading(true);

        if (!form.titulo_asesoria || !form.fechaInicio || !form.horaInicio || !form.fechaFin || !form.horaFin) {
            setError('Título, y todas las fechas y horas (inicio y fin) son requeridas.');
            setIsLoading(false); return;
        }

        const fecha_hora_inicio_str = `${form.fechaInicio} ${form.horaInicio}:00`; // Formato YYYY-MM-DD HH:MM:SS
        const fecha_hora_fin_str = `${form.fechaFin} ${form.horaFin}:00`;

        if (new Date(fecha_hora_fin_str) <= new Date(fecha_hora_inicio_str)) {
            setError('La fecha/hora de fin debe ser posterior a la de inicio.');
            setIsLoading(false); return;
        }

        const dataParaEnviar = {
            asesor_usuario_id: currentUser.id, // El backend lo toma de req.usuario.id
            titulo_asesoria: form.titulo_asesoria,
            descripcion_asesoria: form.descripcion_asesoria,
            materia_id: form.materia_id || null,
            fecha_hora_inicio: fecha_hora_inicio_str,
            fecha_hora_fin: fecha_hora_fin_str,
            modalidad: form.modalidad,
            enlace_o_lugar: form.enlace_o_lugar,
            max_estudiantes_simultaneos: parseInt(form.max_estudiantes_simultaneos) || 1,
            notas_adicionales: form.notas_adicionales,
            estado_disponibilidad: 'disponible' // El asesor siempre publica como disponible
        };

        try {
            if (editandoId !== null) {
                await horarioService.actualizarHorario(editandoId, dataParaEnviar);
                setSuccessMessage('Periodo de asesoría actualizado exitosamente.');
            } else {
                await horarioService.crearHorario(dataParaEnviar);
                setSuccessMessage('Periodo de asesoría publicado exitosamente.');
            }
            resetForm();
            await fetchMisPeriodos(); 
        } catch (err) {
            setError(err.mensaje || (err.response?.data?.mensaje) || 'Error al guardar el periodo de asesoría.');
            console.error("Error en handleSubmit:", err);
        }
        setIsLoading(false);
    };

    const handleEditar = (periodo) => {
        const inicio = new Date(periodo.fecha_hora_inicio);
        const fin = new Date(periodo.fecha_hora_fin);

        setForm({
            titulo_asesoria: periodo.titulo_asesoria || '',
            descripcion_asesoria: periodo.descripcion_asesoria || '',
            materia_id: periodo.materia_id || '',
            fechaInicio: inicio.toISOString().split('T')[0],
            horaInicio: inicio.toTimeString().split(' ')[0].substring(0,5),
            fechaFin: fin.toISOString().split('T')[0],
            horaFin: fin.toTimeString().split(' ')[0].substring(0,5),
            modalidad: periodo.modalidad || 'virtual',
            enlace_o_lugar: periodo.enlace_o_lugar || '',
            max_estudiantes_simultaneos: periodo.max_estudiantes_simultaneos || 1,
            notas_adicionales: periodo.notas_adicionales || ''
        });
        setEditandoId(periodo.id);
        setMostrarForm(true);
        setError(null); setSuccessMessage(null);
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este periodo?")) return;
        setIsLoading(true); setError(null); setSuccessMessage(null);
        try {
            await horarioService.eliminarHorario(id); // Esta función debe estar correcta en el servicio
            setSuccessMessage('Periodo eliminado exitosamente.');
            await fetchMisPeriodos(); 
        } catch (err) {
            setError(err.mensaje || 'Error al eliminar el periodo.');
            console.error("Error en handleEliminar:", err);
        }
        setIsLoading(false);
    };
    
    const formatearFechaHoraSimple = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            return new Date(dateTimeString).toLocaleString('es-MX', { 
                year: 'numeric', month: 'long', day: 'numeric', 
                hour: '2-digit', minute: '2-digit', hour12: true 
            });
        } catch (e) { return 'Fecha Inválida'; }
    };

    if (!esAsesor) {
        return <div className="crear-asesoria-container"><p>Esta sección es solo para asesores.</p></div>;
    }

    return (
        <div className="crear-asesoria-container">
            <button 
                className="btn-toggle-form"
                onClick={() => {
                    setMostrarForm(!mostrarForm);
                    if (!mostrarForm) { 
                         setForm({
                            titulo_asesoria: '', descripcion_asesoria: '', materia_id: '',
                            fechaInicio: '', horaInicio: '09:00',
                            fechaFin: '', horaFin: '17:00',
                            modalidad: 'virtual', enlace_o_lugar: '',
                            max_estudiantes_simultaneos: 1, notas_adicionales: ''
                        });
                    }
                    setEditandoId(null); setError(null); setSuccessMessage(null);
                }}
            >
                {mostrarForm ? 'Cancelar' : 'Publicar Nuevo Periodo de Asesoría'}
            </button>

            {mostrarForm && (
                <form onSubmit={handleSubmit} className="formulario-asesoria">
                    <h3>{editandoId ? 'Actualizar Periodo de Asesoría' : 'Nuevo Periodo de Asesoría'}</h3>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    
                    <div>
                        <label htmlFor="titulo_asesoria">Título:</label>
                        <input name="titulo_asesoria" id="titulo_asesoria" placeholder="Ej: Asesoría General de Cálculo I" value={form.titulo_asesoria} onChange={handleChange} required disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="descripcion_asesoria">Descripción:</label>
                        <textarea name="descripcion_asesoria" id="descripcion_asesoria" placeholder="Temas a cubrir, etc." value={form.descripcion_asesoria} onChange={handleChange} disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="fechaInicio">Fecha de Inicio del Periodo:</label>
                        <input type="date" name="fechaInicio" id="fechaInicio" value={form.fechaInicio} onChange={handleChange} required disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="horaInicio">Hora de Inicio (diaria):</label>
                        <input type="time" name="horaInicio" id="horaInicio" value={form.horaInicio} onChange={handleChange} required disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="fechaFin">Fecha de Fin del Periodo:</label>
                        <input type="date" name="fechaFin" id="fechaFin" value={form.fechaFin} onChange={handleChange} required disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="horaFin">Hora de Fin (diaria):</label>
                        <input type="time" name="horaFin" id="horaFin" value={form.horaFin} onChange={handleChange} required disabled={isLoading} />
                    </div>
                     <div>
                        <label htmlFor="materia_id">Materia Principal (Opcional):</label>
                        <select name="materia_id" id="materia_id" value={form.materia_id} onChange={handleChange} disabled={isLoading || materias.length === 0}>
                            <option value="">-- General / Varias --</option>
                            {materias.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="modalidad">Modalidad:</label>
                        <select name="modalidad" id="modalidad" value={form.modalidad} onChange={handleChange} required disabled={isLoading}>
                            <option value="virtual">Virtual</option>
                            <option value="presencial">Presencial</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="enlace_o_lugar">{form.modalidad === 'virtual' ? 'Enlace Reunión:' : 'Lugar:'}</label>
                        <input type="text" name="enlace_o_lugar" id="enlace_o_lugar" value={form.enlace_o_lugar} onChange={handleChange} disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="max_estudiantes_simultaneos">Máx. Estudiantes por Sesión (1 para individual):</label>
                        <input type="number" name="max_estudiantes_simultaneos" id="max_estudiantes_simultaneos" value={form.max_estudiantes_simultaneos} onChange={handleChange} min="1" disabled={isLoading} />
                    </div>
                     <div>
                        <label htmlFor="notas_adicionales">Notas Adicionales (Opcional):</label>
                        <textarea name="notas_adicionales" id="notas_adicionales" value={form.notas_adicionales} onChange={handleChange} disabled={isLoading} />
                    </div>
                    <button type="submit" disabled={isLoading}>{isLoading ? (editandoId ? 'Actualizando...' : 'Publicando...') : (editandoId ? 'Actualizar Periodo' : 'Publicar Periodo')}</button>
                </form>
            )}

            <h3 style={{marginTop: '30px'}}>Mis Periodos Publicados</h3>
            {isLoading && asesorias.length === 0 && <p>Cargando...</p>}
            {!isLoading && !error && asesorias.length === 0 && <p>Aún no has publicado ningún periodo de asesoría.</p>}
            
            <ul className="lista-asesorias">
                {asesorias.map((a) => (
                    <li key={a.id}>
                        <strong>{a.titulo_asesoria}</strong>
                        {a.nombre_materia && <p className="info">Materia: {a.nombre_materia}</p>}
                        <p className="descripcion">{a.descripcion_asesoria}</p>
                        <p className="fechas">
                            <strong>Desde:</strong> {formatearFechaHoraSimple(a.fecha_hora_inicio)}
                        </p>
                        <p className="fechas">
                            <strong>Hasta:</strong> {formatearFechaHoraSimple(a.fecha_hora_fin)}
                        </p>
                        <p className="info">Modalidad: {a.modalidad} | Max. Est: {a.max_estudiantes_simultaneos || 'N/A'}</p>
                        <p className="info">Estado: {a.estado_disponibilidad}</p>
                        <div className="acciones">
                            <button className="btn-editar" onClick={() => handleEditar(a)} disabled={isLoading}>Editar</button>
                            <button className="btn-eliminar" onClick={() => handleEliminar(a.id)} disabled={isLoading}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CrearAsesoria;
