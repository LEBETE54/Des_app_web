// Ruta: frontend/src/pages/dashboard.jsx

import React, { useState, useEffect } from 'react';
import NavBar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/sidebar';
import '../styles/dashboard/dashboard.css';
import BuscarAsesorias from '../components/BuscarAsesorias'; 
import GestionarHorarios from './GestionarHorarios'; // Este es el que usan los asesores para "Publicar Asesorías"
import Recursos from '../components/Recursos';
import useAuthStore from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

// Componentes Placeholder para las nuevas secciones de estudiante
const AsesoriasInscritas = () => <div style={{padding: '20px'}}><h2>Mis Asesorías Inscritas (Próximamente)</h2><p>Aquí verás las asesorías a las que te has unido.</p></div>;
const MisReservasPendientesEstudiante = () => <div style={{padding: '20px'}}><h2>Mis Reservas Pendientes (Próximamente)</h2><p>Aquí verás tus próximas asesorías.</p></div>;
const HistorialAsesoriasEstudiante = () => <div style={{padding: '20px'}}><h2>Mi Historial de Asesorías Terminadas (Próximamente)</h2><p>Aquí verás las asesorías que ya has completado.</p></div>;


const Dashboard = () => {
  // Determinar la sección inicial basada en el rol o un default
  const userRol = useAuthStore(state => state.user?.rol);
  const [seccionActiva, setSeccionActiva] = useState(userRol === 'asesor' ? 'crear' : 'buscar');
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  // Si el rol cambia después de cargar (poco probable pero seguro)
  useEffect(() => {
    setSeccionActiva(userRol === 'asesor' ? 'crear' : 'buscar');
  }, [userRol]);


  const renderSeccion = () => {
    switch (seccionActiva) {
      // Comunes o default
      case 'buscar':
        return <BuscarAsesorias />;
      case 'recursos':
        return <Recursos />;
      
      // Para Asesores
      case 'crear': // El asesor crea/publica sus horarios de disponibilidad
        return userRol === 'asesor' ? <GestionarHorarios /> : <p>Acceso denegado.</p>;
      
      // Para Estudiantes
      case 'inscritas':
        return userRol === 'estudiante' ? <AsesoriasInscritas /> : <p>Acceso denegado.</p>;
      case 'pendientes': // "Mis Reservas (son asesorias pendientes)"
        return userRol === 'estudiante' ? <MisReservasPendientesEstudiante /> : <p>Acceso denegado.</p>;
      case 'terminadasEstudiante': // "asesorias terminadas, asesorias que el user termino"
        return userRol === 'estudiante' ? <HistorialAsesoriasEstudiante /> : <p>Acceso denegado.</p>;
      
      default:
        return userRol === 'asesor' ? <GestionarHorarios /> : <BuscarAsesorias />;
    }
  };

  // Si aún no se ha determinado el estado de autenticación o el usuario, muestra un loader
  if (isAuthenticated === null) { 
      return <div style={{textAlign: 'center', marginTop: '50px'}}>Cargando Dashboard...</div>;
  }
  // Si ya se determinó que no está autenticado, no se renderiza nada aquí porque el useEffect redirige.

  return (
    <div className="dashboard-container">
        <div className="dashboard-navbar">
            <NavBar usuario={user} /> 
        </div>
        <div className="dashboard-content">
            <Sidebar 
                onSelect={setSeccionActiva} 
                usuarioRol={userRol}
                seccionActual={seccionActiva} // Para el estilo activo
            />
            <div className="main-section">
                {renderSeccion()}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
