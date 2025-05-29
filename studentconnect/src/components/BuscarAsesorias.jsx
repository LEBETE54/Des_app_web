// Ruta: frontend/src/components/BuscarAsesorias.jsx
import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import horarioService from '../services/horarioService';
import materiaService from '../services/materiaService';
import { useNavigate } from 'react-router-dom'; // Para redirigir si no está logueado para reservar
// import '../styles/BuscarAsesorias.css'; // Crea este archivo para estilos

// Componente para una tarjeta de Asesoría individual
const AsesoriaCard = ({ asesoria, onReservarClick, isAuthenticated }) => {
    const formatearFechaParaCard = (fechaString) => {
        if (!fechaString) return 'Fecha no disponible';
        const parts = String(fechaString).split('-');
        if (parts.length === 3) {
            const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
            return dateObj.toLocaleDateString('es-MX', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        }
        return 'Fecha inválida';
    };

    return (
        <div className="asesoria-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{asesoria.nombre_materia || 'Asesoría General'}</h3>
            <p><strong>Asesor:</strong> {asesoria.nombre_asesor || 'N/A'}</p>
            {asesoria.foto_asesor && <img src={`http://localhost:4000${asesoria.foto_asesor}`} alt={asesoria.nombre_asesor} style={{width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px'}} onError={(e) => e.target.style.display='none'}/>}
            <p><strong>Fecha:</strong> {formatearFechaParaCard(asesoria.fecha)}</p>
            <p><strong>Horario:</strong> {asesoria.hora_inicio} - {asesoria.hora_fin}</p>
            <p><strong>Modalidad:</strong> <span style={{textTransform: 'capitalize'}}>{asesoria.modalidad}</span></p>
            {asesoria.enlace_o_lugar && asesoria.modalidad === 'presencial' && <p><strong>Lugar:</strong> {asesoria.enlace_o_lugar}</p>}
            {asesoria.asesor_descripcion_corta && <p><small><em>"{asesoria.asesor_descripcion_corta}"</em></small></p>}
            {asesoria.asesor_tarifa && <p><strong>Tarifa:</strong> {asesoria.asesor_tarifa}</p>}
            
            {isAuthenticated && (
                <button 
                    onClick={() => onReservarClick(asesoria.id)} 
                    style={{marginTop: '10px', padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                >
                    Reservar Asesoría
                </button>
            )}
            {!isAuthenticated && (
                 <p style={{marginTop: '10px'}}><small><em>Inicia sesión para reservar.</em></small></p>
            )}
        </div>
    );
};


const BuscarAsesorias = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    // const user = useAuthStore(state => state.user); // Descomenta si necesitas datos del usuario
    const navigate = useNavigate();

    const [asesoriasMostradas, setAsesoriasMostradas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [filtroMateria, setFiltroMateria] = useState('');
    const [filtroBusquedaTexto, setFiltroBusquedaTexto] = useState('');
    const [pestanaActiva, setPestanaActiva] = useState('enEspera'); // 'enEspera', 'activas', 'terminadas'

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const cargarMaterias = useCallback(async () => {
        try {
            const data = await materiaService.obtenerTodasLasMaterias();
            setMaterias(data || []);
        } catch (err) {
            console.error("Error cargando materias para filtro:", err);
            setError(prev => prev + (prev ? "; " : "") + 'No se pudieron cargar las materias.');
        }
    }, []);

    const fetchAndFilterAsesorias = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const filtrosApi = {};
            if (filtroMateria) filtrosApi.materia_id = filtroMateria;
            // El backend en `findDisponiblesParaReserva` ya filtra por `estado_slot = 'disponible'` y que sean futuras.
            // Para las pestañas, necesitaremos más lógica o diferentes endpoints.
            
            let horariosFetched = await horarioService.obtenerHorariosDisponiblesParaEstudiantes(filtrosApi);
            if (!Array.isArray(horariosFetched)) { // Asegurarse de que sea un array
                console.warn("La respuesta de obtenerHorariosDisponiblesParaEstudiantes no fue un array:", horariosFetched);
                horariosFetched = [];
            }

            let filtradosPorEstadoYTexto = [];
            const ahora = new Date();

            // Lógica de filtrado por pestañas (simplificada, idealmente el backend ayuda más)
            if (pestanaActiva === 'enEspera') {
                filtradosPorEstadoYTexto = horariosFetched.filter(a => new Date(`${a.fecha}T${a.hora_inicio}`) > ahora);
            } else if (pestanaActiva === 'activas') {
                filtradosPorEstadoYTexto = horariosFetched.filter(a => {
                    const inicioAsesoria = new Date(`${a.fecha}T${a.hora_inicio}`);
                    const finAsesoria = new Date(`${a.fecha}T${a.hora_fin}`);
                    return inicioAsesoria <= ahora && ahora < finAsesoria;
                });
            } else if (pestanaActiva === 'terminadas') {
                // Esta pestaña necesitará un endpoint diferente que traiga horarios pasados o completados.
                // Por ahora, estará vacía o mostrará un mensaje.
                // O podríamos filtrar de todosLosDisponibles si el backend los enviara todos (no es el caso actual)
                filtradosPorEstadoYTexto = []; // Placeholder
                setError(prev => prev + (prev ? "; " : "") + "La vista de 'terminadas' requiere configuración adicional del backend.");
            }
            
            if (filtroBusquedaTexto) {
                const busquedaLower = filtroBusquedaTexto.toLowerCase();
                filtradosPorEstadoYTexto = filtradosPorEstadoYTexto.filter(a => 
                    (a.nombre_materia && a.nombre_materia.toLowerCase().includes(busquedaLower)) ||
                    (a.nombre_asesor && a.nombre_asesor.toLowerCase().includes(busquedaLower)) ||
                    (a.asesor_descripcion_corta && a.asesor_descripcion_corta.toLowerCase().includes(busquedaLower)) ||
                    (a.titulo && a.titulo.toLowerCase().includes(busquedaLower)) // Si los horarios tienen un título
                );
            }
            setAsesoriasMostradas(filtradosPorEstadoYTexto);
        } catch (err) {
            setError(err.mensaje || 'Error al cargar asesorías.');
            setAsesoriasMostradas([]);
        }
        setIsLoading(false);
    }, [filtroMateria, pestanaActiva, filtroBusquedaTexto]);

    useEffect(() => {
        cargarMaterias();
    }, [cargarMaterias]);

    useEffect(() => {
        fetchAndFilterAsesorias();
    }, [fetchAndFilterAsesorias]);

    const handleReservarClick = (horarioId) => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para poder reservar una asesoría.");
            navigate('/login');
            return;
        }
        // Aquí irá la lógica para navegar a una página de confirmación de reserva o abrir un modal.
        // Pasaremos el horarioId.
        console.log(`Usuario quiere reservar el horario con ID: ${horarioId}`);
        // navigate(`/reservar-asesoria/${horarioId}`); // Ejemplo de navegación
        alert(`Funcionalidad de reserva para horario ID ${horarioId} aún no implementada.`);
    };

    return (
        <div className="buscar-asesorias-container" style={{padding: '20px', maxWidth: '1200px', margin: 'auto'}}>
            <h1 style={{textAlign: 'center', marginBottom: '30px'}}>Encuentra tu Asesoría Ideal</h1>

            <div className="filtros-busqueda" style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
                <input 
                    type="text" 
                    placeholder="Buscar por materia, asesor, tema..." 
                    value={filtroBusquedaTexto}
                    onChange={(e) => setFiltroBusquedaTexto(e.target.value)}
                    style={{padding: '10px', flexGrow: 1, borderRadius: '5px', border: '1px solid #ced4da', minWidth: '250px'}}
                />
                <select 
                    value={filtroMateria} 
                    onChange={(e) => setFiltroMateria(e.target.value)}
                    style={{padding: '10px', borderRadius: '5px', border: '1px solid #ced4da', minWidth: '200px'}}
                >
                    <option value="">Todas las Materias</option>
                    {materias.map(m => (
                        <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="pestañas-asesorias" style={{marginBottom: '20px', display: 'flex', justifyContent:'center', gap: '10px', borderBottom: '1px solid #dee2e6'}}>
                {['enEspera', 'activas', 'terminadas'].map(pestana => (
                    <button 
                        key={pestana}
                        onClick={() => setPestanaActiva(pestana)} 
                        style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            border: 'none',
                            borderBottom: pestanaActiva === pestana ? '3px solid #007bff' : '3px solid transparent',
                            background: 'none',
                            fontWeight: pestanaActiva === pestana ? 'bold' : 'normal',
                            color: pestanaActiva === pestana ? '#007bff' : '#495057'
                        }}
                    >
                        {pestana === 'enEspera' ? 'Próximas' : pestana.charAt(0).toUpperCase() + pestana.slice(1)}
                    </button>
                ))}
            </div>

            {isLoading && <p style={{textAlign: 'center'}}>Buscando asesorías...</p>}
            {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
            
            {!isLoading && asesoriasMostradas.length === 0 && (
                <p style={{textAlign: 'center', padding: '20px', color: '#6c757d'}}>
                    No hay asesorías disponibles que coincidan con los criterios actuales para la pestaña "{pestanaActiva === 'enEspera' ? 'Próximas' : pestanaActiva}".
                </p>
            )}

            <div className="lista-asesorias">
                {asesoriasMostradas.map(asesoria => (
                    <AsesoriaCard key={asesoria.id} asesoria={asesoria} onReservarClick={handleReservarClick} isAuthenticated={isAuthenticated} />
                ))}
            </div>
        </div>
    );
};

export default BuscarAsesorias;

