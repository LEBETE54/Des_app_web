import React, { useState, useEffect } from 'react';
import Navbardash from '../componenetes/Dashboard/NavBardash';
import Sidebar from '../componenetes/Dashboard/Sidebar';
import '../styles/dashboard/main.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Datos de demostración locales
  const demoData = {
    usuario: {
      nombre: "Invitado",
      carrera: "Ingeniería en Sistemas",
      semestre: 8,
      foto_perfil: "/vite.svg",
      habilidades: ["React", "Node.js", "JavaScript"]
    },
    asesorias: [
      {
        id: 1,
        titulo: "Introducción a React",
        fecha: "2024-01-15",
        estado: "completada"
      }
    ]
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/public/dashboard');
        
        // Si falla la API, usar datos locales
        if (!response.ok) {
          setDashboardData(demoData);
          return;
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error:', error);
        setDashboardData(demoData); // Usar datos locales como respaldo
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      <Navbardash /> {/* Asegurar que Navbar no requiera props */}
      
      <div className="dashboard-content">
        <Sidebar activeSection="perfil" /> {/* Verificar que Sidebar no dependa de datos de usuario */}
        
        <main className="dashboard-main">
          <section className="profile-section">
            <div className="profile-header">
              <img 
                src={dashboardData?.usuario?.foto_perfil || '/default-profile.png'} 
                alt="Foto de perfil" 
                className="profile-photo"
              />
              <div className="profile-info">
                <h2>{dashboardData?.usuario?.nombre || 'Usuario Invitado'}</h2>
                <p>
                  {dashboardData?.usuario?.carrera || 'Carrera de Ejemplo'} - 
                  Semestre {dashboardData?.usuario?.semestre || 'X'}
                </p>
              </div>
            </div>

            <div className="skills-container">
              <h3>Habilidades</h3>
              <div className="skills-grid">
                {(dashboardData?.usuario?.habilidades || []).map((habilidad, index) => (
                  <div key={index} className="skill-card">
                    {habilidad}
                  </div>
                ))}
              </div>
            </div>

            <div className="asesorias-container">
              <h3>Asesorías Recientes</h3>
              <div className="asesorias-grid">
                {(dashboardData?.asesorias || []).map((asesoria, index) => (
                  <div key={index} className="asesoria-card">
                    <h4>{asesoria.titulo || "Título de Ejemplo"}</h4>
                    <p>{asesoria.fecha ? new Date(asesoria.fecha).toLocaleDateString() : "Fecha no disponible"}</p>
                    <span className={`status ${asesoria.estado || 'pendiente'}`}>
                      {asesoria.estado || 'pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;