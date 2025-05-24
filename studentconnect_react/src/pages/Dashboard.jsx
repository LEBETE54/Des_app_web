import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../componenetes/Home/NavBarHome';
import Sidebar from '../componenetes/Dashboard/Sidebar';
import '../styles/dashboard/main.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Error al cargar el dashboard');
        
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <Sidebar activeSection="perfil" />
        
        <main className="dashboard-main">
          {/* Sección Perfil */}
          <section className="profile-section">
            <div className="profile-header">
              <img 
                src={dashboardData.usuario.foto_perfil || '/default-profile.png'} 
                alt="Foto de perfil" 
                className="profile-photo"
              />
              <div className="profile-info">
                <h2>{dashboardData.usuario.nombre}</h2>
                <p>{dashboardData.usuario.carrera} - Semestre {dashboardData.usuario.semestre}</p>
              </div>
            </div>

            {/* Habilidades */}
            <div className="skills-container">
              <h3>Habilidades</h3>
              <div className="skills-grid">
                {dashboardData.usuario.habilidades.map((habilidad, index) => (
                  <div key={index} className="skill-card">
                    {habilidad}
                  </div>
                ))}
              </div>
            </div>

            {/* Asesorías Recientes */}
            <div className="asesorias-container">
              <h3>Asesorías Recientes</h3>
              <div className="asesorias-grid">
                {dashboardData.asesorias.map(asesoria => (
                  <div key={asesoria.id} className="asesoria-card">
                    <h4>{asesoria.titulo}</h4>
                    <p>{new Date(asesoria.fecha).toLocaleDateString()}</p>
                    <span className={`status ${asesoria.estado}`}>
                      {asesoria.estado}
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