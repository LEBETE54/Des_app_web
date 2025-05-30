// Ruta: frontend/src/components/BuscarAsesorias.jsx
import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import horarioService from '../services/horarioService';
import materiaService from '../services/materiaService';
import reservaService from '../services/reservaService';
import { useNavigate } from 'react-router-dom'; // Para redirigir si no está logueado para reservar


const AsesoriaCard = ({ asesoria, onReservarClick, isAuthenticated, user }) => {



    return (
        <div className="asesoria-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{asesoria.nombre_materia || 'Asesoría General'}</h3>
            <p><strong>Asesor:</strong> {asesoria.nombre_asesor || 'N/A'}</p>
            {asesoria.foto_asesor && <img src={`http://localhost:4000${asesoria.foto_asesor}`} alt={asesoria.nombre_asesor} style={{width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px'}} onError={(e) => e.target.style.display='none'}/>}
           <p><strong>Fecha:</strong> {new Date(asesoria.fecha_hora_inicio).toLocaleDateString('es-MX')}</p>
            <p><strong>Horario:</strong> 
            {new Date(asesoria.fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            {new Date(asesoria.fecha_hora_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Modalidad:</strong> <span style={{textTransform: 'capitalize'}}>{asesoria.modalidad}</span></p>
            {asesoria.enlace_o_lugar && asesoria.modalidad === 'presencial' && <p><strong>Lugar:</strong> {asesoria.enlace_o_lugar}</p>}
            {asesoria.asesor_descripcion_corta && <p><small><em>"{asesoria.asesor_descripcion_corta}"</em></small></p>}
            {isAuthenticated && user?.id !== asesoria.asesor_usuario_id && (
            <button onClick={() => onReservarClick(asesoria.id)}>
            Reservar asesoría
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

    const navigate = useNavigate();
    const [asesoriasMostradas, setAsesoriasMostradas] = useState([]);
    const [filtroMateria, setFiltroMateria] = useState('');
    const [filtroBusquedaTexto, setFiltroBusquedaTexto] = useState('');
    const [pestanaActiva, setPestanaActiva] = useState('enEspera'); // 'enEspera', 'activas', 'terminadas'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const fetchAndFilterAsesorias = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const filtrosApi = {};
            if (filtroMateria) filtrosApi.materia_id = filtroMateria;
            
            let horariosFetched = await horarioService.obtenerHorariosDisponiblesParaEstudiantes(filtrosApi);
            if (!Array.isArray(horariosFetched)) { 
                console.warn("La respuesta de obtenerHorariosDisponiblesParaEstudiantes no fue un array:", horariosFetched);
                horariosFetched = [];
            }

            let filtradosPorEstadoYTexto = [];
            const ahora = new Date();

            if (pestanaActiva === 'enEspera') {
                filtradosPorEstadoYTexto = horariosFetched.filter(a => new Date(a.fecha_hora_inicio) > ahora);
                } else if (pestanaActiva === 'activas') {
                filtradosPorEstadoYTexto = horariosFetched.filter(a => {
                const inicio = new Date(a.fecha_hora_inicio);
                const fin = new Date(a.fecha_hora_fin);
    return inicio <= ahora && ahora < fin;
  });
            } else if (pestanaActiva === 'terminadas') {
                filtradosPorEstadoYTexto = []; // Placeholder
                setError(prev => prev + (prev ? "; " : "") + "Un 70 y sin ver profe");
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
        fetchAndFilterAsesorias();
    }, [fetchAndFilterAsesorias]);

   const user = useAuthStore(state => state.user); 

   const handleReservarClick = async (horarioId) => {
  if (!isAuthenticated || !user) {
    alert("Debes iniciar sesión para reservar.");
    return navigate('/login');
  }

  try {
    const reservas = await reservaService.obtenerReservasPorEstudiante(user.id);
    const yaReservada = reservas.some(r => r.horario_disponibilidad_id === horarioId);

    if (yaReservada) {
      alert("Ya estás inscrito a esta asesoría.");
      return;
    }

    await reservaService.reservarAsesoria(horarioId, user.id);
    alert("¡Te has inscrito exitosamente a la asesoría!");
    fetchAndFilterAsesorias(); 
  } catch (err) {
    console.error("Error al reservar:", err);
    alert("Hubo un problema al reservar la asesoría.");
  }
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
                   <AsesoriaCard 
                    key={asesoria.id} 
                    asesoria={asesoria} 
                    onReservarClick={handleReservarClick} 
                    isAuthenticated={isAuthenticated}
                    user={user}/>
                ))}
            </div>
        </div>
    );
};

export default BuscarAsesorias;

