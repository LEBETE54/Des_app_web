import { useState, useEffect } from 'react';
import Navbardash from '../componenetes/Dashboard/NavBardash';
import Sidebar from '../componenetes/Dashboard/Sidebar';
import '../styles/dashboard/main.css';

const MisAsesorias = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsesorias = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/mis-asesorias', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setAsesorias(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsesorias();
  }, []);

  const cancelarAsesoria = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/asesorias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAsesorias(asesorias.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error cancelando:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbardash />
      <Sidebar activeSection="mis-asesorias" />
      
      <main className="main-content">
        <h2>Mis Asesorías Programadas</h2>
        
        <div className="asesorias-list">
          {asesorias.map(asesoria => (
            <div key={asesoria.id} className="asesoria-item">
              <div className="item-header">
                <h3>{asesoria.tema}</h3>
                <span className={`status ${asesoria.estado}`}>{asesoria.estado}</span>
              </div>
              <div className="item-details">
                <p><strong>Tutor:</strong> {asesoria.tutor_nombre}</p>
                <p><strong>Fecha:</strong> {new Date(asesoria.fecha).toLocaleString()}</p>
                {asesoria.estado === 'pendiente' && (
                  <button 
                    onClick={() => cancelarAsesoria(asesoria.id)}
                    className="cancel-button"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MisAsesorias;