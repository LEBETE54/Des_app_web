import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import horarioService from '../services/horarioService';
import materiaService from '../services/materiaService';
import Navbar from '../components/Home/NavBarHome.jsx';
import '../styles/GestionarHorarios.css';

const GestionarHorarios = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const userRol = useAuthStore(state => state.user?.rol);
    const navigate = useNavigate();

    const [tituloAsesoria, setTituloAsesoria] = useState('');
    const [descripcionAsesoria, setDescripcionAsesoria] = useState('');
    const [fechaInicioInput, setFechaInicioInput] = useState('');
    const [horaInicioInput, setHoraInicioInput] = useState('09:00');
    const [fechaFinInput, setFechaFinInput] = useState('');
    const [horaFinInput, setHoraFinInput] = useState('10:00');
    const [materiaId, setMateriaId] = useState('');
    const [modalidad, setModalidad] = useState('virtual');
    const [enlaceOLugar, setEnlaceOLugar] = useState('');
    const [maxEstudiantes, setMaxEstudiantes] = useState(1);
    const [notasAdicionales, setNotasAdicionales] = useState('');

    const [misPeriodos, setMisPeriodos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const cargarMisPeriodos = useCallback(async () => {
        if (isAuthenticated && userRol === 'asesor') {
            setIsLoading(true); setError('');
            try {
                const data = await horarioService.obtenerMisHorarios();
                setMisPeriodos(data || []);
            } catch (err) { 
                setError(err.mensaje || 'Error al cargar mis periodos de asesoría.');
                setMisPeriodos([]);
            }
            setIsLoading(false);
        }
    }, [isAuthenticated, userRol]);

    useEffect(() => {
        if (!isAuthenticated || userRol !== 'asesor') {
            navigate('/login', {replace: true});
            return;
        }
        const cargarData = async () => {
            try {
                const matData = await materiaService.obtenerTodasLasMaterias();
                setMaterias(matData || []);
            } catch (err) { 
                console.error("Error cargando materias:", err);
                setError(prev => `${prev} ${err.mensaje || 'Error materias.'}`.trim());
            }
        };
        cargarData();
        cargarMisPeriodos(); 
    }, [isAuthenticated, userRol, cargarMisPeriodos, navigate]);

    const limpiarFormulario = () => {
        setTituloAsesoria(''); setDescripcionAsesoria('');
        setFechaInicioInput(''); setHoraInicioInput('09:00'); 
        setFechaFinInput(''); setHoraFinInput('10:00');
        setMateriaId(''); setModalidad('virtual'); setEnlaceOLugar('');
        setMaxEstudiantes(1); setNotasAdicionales('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccessMessage(''); setIsLoading(true);

        // Validación más explícita en el frontend
        if (!tituloAsesoria.trim() || !fechaInicioInput.trim() || !horaInicioInput.trim() || !fechaFinInput.trim() || !horaFinInput.trim()) {
            setError('Título, Fecha de Inicio, Hora de Inicio, Fecha de Fin y Hora de Fin son todos requeridos y no pueden estar vacíos.');
            setIsLoading(false); 
            return;
        }
        
        const dataParaEnviar = {
            titulo_asesoria: tituloAsesoria.trim(),
            descripcion_asesoria: descripcionAsesoria.trim(),
            materia_id: materiaId || null,
            fecha: fechaInicioInput,         // Para 'fecha' en el controller
            hora_inicio: horaInicioInput,   // Para 'hora_inicio' en el controller
            fechaFin: fechaFinInput,        // Para 'fechaFin' en el controller
            hora_fin_form: horaFinInput,    // Para 'hora_fin_form' en el controller
            modalidad,
            enlace_o_lugar: enlaceOLugar.trim(),
            max_estudiantes_simultaneos: parseInt(maxEstudiantes) || 1,
            notas_adicionales: notasAdicionales.trim(),
        };
        
        const inicioCompleto = new Date(`${dataParaEnviar.fecha}T${dataParaEnviar.hora_inicio}`);
        const finCompleto = new Date(`${dataParaEnviar.fechaFin}T${dataParaEnviar.hora_fin_form}`);

        if (finCompleto <= inicioCompleto) {
            setError('La fecha/hora de fin debe ser estrictamente posterior a la fecha/hora de inicio.');
            setIsLoading(false); return;
        }

        console.log("FRONTEND: Datos que se enviarán al backend (dataParaEnviar):", JSON.stringify(dataParaEnviar, null, 2));
        // ---------------------------------

        try {
            const creado = await horarioService.crearHorario(dataParaEnviar); 
            setMisPeriodos(prev => [creado, ...prev].sort((a,b) => new Date(b.fecha_hora_inicio) - new Date(a.fecha_hora_inicio)));
            setSuccessMessage('Periodo de asesoría publicado exitosamente!');
            limpiarFormulario();
        } catch (err) { 
            setError(err.mensaje || 'Error al publicar el periodo.'); 
            console.error("Error en handleSubmit al llamar a crearHorario:", err);
        }
        setIsLoading(false);
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este periodo de disponibilidad?")) return;
        setIsLoading(true); setError(''); setSuccessMessage('');
        try {
            await horarioService.eliminarHorario(id);
            setMisPeriodos(prev => prev.filter(h => h.id !== id));
            setSuccessMessage('Periodo eliminado.');
        } catch (err) { setError(err.mensaje || 'Error al eliminar.'); }
        setIsLoading(false);
    };
    
    const formatearFechaHoraParaMostrar = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            return new Date(dateTimeString).toLocaleString('es-MX', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            });
        } catch (e) { return 'Fecha inválida'; }
    };

    if (!isAuthenticated || userRol !== 'asesor') { 
        return (
            <>
                <Navbar />
                <div className="acceso-denegado-container">
                    <h1>Acceso Denegado</h1>
                    <p>Debes ser un asesor e iniciar sesión para acceder a esta página.</p>
                    <Link to="/login">Ir a Iniciar Sesión</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="gestionar-horarios-container">
                <h1>Publicar Periodo de Disponibilidad</h1>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="form-publicar-asesoria">
                    <h2>Nuevo Periodo de Asesoría</h2>
                    <div>
                        <label htmlFor="tituloAsesoria">Título de la Asesoría:</label>
                        <input type="text" id="tituloAsesoria" value={tituloAsesoria} onChange={e => setTituloAsesoria(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div className="datetime-group">
                        <div>
                            <label htmlFor="fechaInicioInput">Fecha de Inicio:</label>
                            <input type="date" id="fechaInicioInput" value={fechaInicioInput} onChange={e => setFechaInicioInput(e.target.value)} required disabled={isLoading} />
                        </div>
                        <div>
                            <label htmlFor="horaInicioInput">Hora de Inicio:</label>
                            <input type="time" id="horaInicioInput" value={horaInicioInput} onChange={e => setHoraInicioInput(e.target.value)} required disabled={isLoading} />
                        </div>
                    </div>
                    <div className="datetime-group">
                        <div>
                            <label htmlFor="fechaFinInput">Fecha de Fin:</label>
                            <input type="date" id="fechaFinInput" value={fechaFinInput} onChange={e => setFechaFinInput(e.target.value)} required disabled={isLoading} />
                        </div>
                        <div>
                            <label htmlFor="horaFinInput">Hora de Fin:</label>
                            <input type="time" id="horaFinInput" value={horaFinInput} onChange={e => setHoraFinInput(e.target.value)} required disabled={isLoading} />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="descripcionAsesoria">Descripción (Opcional):</label>
                        <textarea id="descripcionAsesoria" value={descripcionAsesoria} onChange={e => setDescripcionAsesoria(e.target.value)} disabled={isLoading}></textarea>
                    </div>
                     <div>
                        <label htmlFor="materiaIdPub">Materia Principal (Opcional):</label>
                        <select id="materiaIdPub" value={materiaId} onChange={e => setMateriaId(e.target.value)} disabled={isLoading || materias.length === 0}>
                            <option value="">-- General / Varias --</option>
                            {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        </select>
                         {materias.length === 0 && !isLoading && <small>No hay materias cargadas.</small>}
                    </div>
                    <div>
                        <label htmlFor="modalidadPub">Modalidad:</label>
                        <select id="modalidadPub" value={modalidad} onChange={e => setModalidad(e.target.value)} required disabled={isLoading}>
                            <option value="virtual">Virtual</option>
                            <option value="presencial">Presencial</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="enlaceOLugarPub">{modalidad === 'virtual' ? 'Enlace Reunión:' : 'Lugar:'}</label>
                        <input type="text" id="enlaceOLugarPub" value={enlaceOLugar} onChange={e => setEnlaceOLugar(e.target.value)} placeholder={modalidad === 'virtual' ? 'Ej: https://meet.google.com/...' : 'Ej: Biblioteca, Cubículo 5'} disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="maxEstudiantes">Máx. Estudiantes:</label>
                        <input type="number" id="maxEstudiantes" value={maxEstudiantes} onChange={e => setMaxEstudiantes(e.target.value)} min="1" disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="notasAdicionales">Notas Adicionales:</label>
                        <textarea id="notasAdicionales" value={notasAdicionales} onChange={e => setNotasAdicionales(e.target.value)} disabled={isLoading}></textarea>
                    </div>
                    <button type="submit" disabled={isLoading}>{isLoading ? 'Publicando...' : 'Publicar Periodo'}</button>
                </form>

                <h2>Mis Periodos Publicados</h2>
            </div>
        </>
    );
};

export default GestionarHorarios;
