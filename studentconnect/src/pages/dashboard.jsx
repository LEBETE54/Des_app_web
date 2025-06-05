import React, { useState, useEffect } from 'react';
import NavBar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/sidebar';
import '../styles/dashboard/dashboard.css';
import BuscarAsesorias from '../components/BuscarAsesorias'; 
import GestionarHorarios from './GestionarHorarios';
import Recursos from '../components/Recursos';
import useAuthStore from '../store/authStore';
import reservaService from '../services/reservaService';
import { useNavigate, useLocation } from 'react-router-dom';

const AsesoriasInscritas = () => {
  const user = useAuthStore(state => state.user);
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
const handleSalirClick = async (horarioId) => {
  try {
    await reservaService.salirDeAsesoria(horarioId, user.id);
    alert("Te has salido de la asesoría.");
    window.location.reload();
  } catch (err) {
    console.error("Error al salir de la asesoría:", err);
    alert("No se pudo salir de la asesoría.");
  }
};

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        if (user?.id) {
          const data = await reservaService.obtenerReservasPorEstudiante(user.id);
          setReservas(data);
        }
      } catch (err) {
        console.error("Error al cargar reservas:", err);
        setError('No se pudieron cargar tus asesorías inscritas.');
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
  }, [user]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mis Asesorías Inscritas</h2>

      {cargando && <p>Cargando tus reservas...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!cargando && reservas.length === 0 && (
        <p>No estás inscrito a ninguna asesoría.</p>
      )}
      {!cargando && reservas.length > 0 && reservas.map(r => (
        <div key={r.reserva_id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px', borderRadius: '8px' }}>
        <h3>{r.titulo_asesoria}</h3>
        <p><strong>Asesor:</strong> {r.nombre_asesor}</p>
        <p><strong>Inicio:</strong> {new Date(r.fecha_hora_inicio).toLocaleString()}</p>
        <p><strong>Fin:</strong> {new Date(r.fecha_hora_fin).toLocaleString()}</p>
        <p><strong>Lugar:</strong> {r.lugar || r.enlace_o_lugar || 'No especificado'}</p>
        <p><strong>Estado:</strong> {r.estado_reserva}</p>
         {/* Botón de salir */}
    <button
      onClick={() => handleSalirClick(r.horario_disponibilidad_id)}
      style={{
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px'
      }}
    >
      Salir de la asesoría
    </button>
  </div>
))}
    </div>
  );
};

 

const Dashboard = () => {
  const userRol = useAuthStore(state => state.user?.rol);
  const [seccionActiva, setSeccionActiva] = useState('buscar');

  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    setSeccionActiva(userRol === 'asesor' ? 'crear' : 'buscar');
  }, [userRol]);

  const renderSeccion = () => {
    switch (seccionActiva) {
      case 'buscar':
        return <BuscarAsesorias />;
      case 'recursos':
        return <Recursos />;
      case 'crear':
        return <GestionarHorarios />;
      case 'inscritas':
        return <AsesoriasInscritas />;
      case 'recordatorios':
        return <Recordatorios />; 
      default:
        return userRol === 'asesor' ? <GestionarHorarios /> : <BuscarAsesorias />;
    }
  };

  if (isAuthenticated === null) { 
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Cargando Dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-navbar">
        <NavBar usuario={user} /> 
      </div>
      <div className="dashboard-content">
        <Sidebar 
          onSelect={setSeccionActiva} 
          seccionActual={seccionActiva}
        />
        <div className="main-section">
          {renderSeccion()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

