import { useState, useEffect } from 'react';
import Navbardash from '../componenetes/Dashboard/NavBardash';
import Sidebar from '../componenetes/Dashboard/Sidebar';
import '../styles/dashboard/main.css';

const BuscarAsesorias = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsesorias = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/asesorias?search=${searchTerm}`);
        const data = await response.json();
        setAsesorias(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsesorias();
  }, [searchTerm]);

  const handleJoinSession = async (asesoriaId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/asesorias/${asesoriaId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        alert('Te has unido a la asesoría exitosamente!');
        // Actualizar lista
        const updated = asesorias.filter(a => a.id !== asesoriaId);
        setAsesorias(updated);
      }
    } catch (error) {
      console.error('Error al unirse:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbardash />
      <Sidebar activeSection="buscar" />
      
      <main className="main-content">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por tema o tutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="asesorias-grid">
          {asesorias.map(asesoria => (
            <div key={asesoria.id} className="asesoria-card">
              <div className="card-header">
                <h3>{asesoria.tema}</h3>
                <span className={`status ${asesoria.estado}`}>{asesoria.estado}</span>
              </div>
              <div className="card-body">
                <p><strong>Tutor:</strong> {asesoria.tutor_nombre}</p>
                <p><strong>Fecha:</strong> {new Date(asesoria.fecha).toLocaleString()}</p>
                <button 
                  onClick={() => handleJoinSession(asesoria.id)}
                  className="join-button"
                >
                  Unirse a sesión
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BuscarAsesorias;