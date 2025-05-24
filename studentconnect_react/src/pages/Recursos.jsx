import { useState, useEffect } from 'react';
import Sidebar from "../componenetes/Dashboard/Sidebar.jsx";
import Navbardash from "../componenetes/Dashboard/NavBardash.jsx";
import "../styles/Recursos/global.css";

export default function RecursosPage() {
  const [recursos, setRecursos] = useState([]);
  const [nuevoRecurso, setNuevoRecurso] = useState({
    titulo: '',
    descripcion: '',
    enlace: '',
    tipo: 'enlace'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener recursos al cargar el componente
  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/recursos');
        if (!response.ok) throw new Error('Error al cargar recursos');
        const data = await response.json();
        setRecursos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecursos();
  }, []);

  // Manejar envío de formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/recursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoRecurso)
      });

      if (!response.ok) throw new Error('Error al crear recurso');
      
      const createdRecurso = await response.json();
      setRecursos([...recursos, createdRecurso]);
      
      // Resetear formulario
      setNuevoRecurso({
        titulo: '',
        descripcion: '',
        enlace: '',
        tipo: 'enlace'
      });
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar eliminación de recurso
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/recursos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error al eliminar recurso');
      
      setRecursos(recursos.filter(recurso => recurso.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Cargando recursos...</div>;

  return (
    <div className="recursos-container">
      <Navbardash />
      <Sidebar />
      
      <main className="main-content">
        <div className="recursos-form">
          <h2>Agregar Nuevo Recurso</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título:</label>
              <input
                type="text"
                value={nuevoRecurso.titulo}
                onChange={(e) => setNuevoRecurso({...nuevoRecurso, titulo: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                value={nuevoRecurso.descripcion}
                onChange={(e) => setNuevoRecurso({...nuevoRecurso, descripcion: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Enlace/URL:</label>
              <input
                type="url"
                value={nuevoRecurso.enlace}
                onChange={(e) => setNuevoRecurso({...nuevoRecurso, enlace: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Tipo:</label>
              <select
                value={nuevoRecurso.tipo}
                onChange={(e) => setNuevoRecurso({...nuevoRecurso, tipo: e.target.value})}
              >
                <option value="video">Video</option>
                <option value="documento">Documento</option>
                <option value="enlace">Enlace</option>
              </select>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Agregar Recurso'}
            </button>
          </form>
        </div>

        <div className="recursos-list">
          <h2>Recursos Disponibles ({recursos.length})</h2>
          {error && <div className="error-message">{error}</div>}
          
          <div className="recursos-grid">
            {recursos.map((recurso) => (
              <div key={recurso.id} className="recurso-card">
                <div className="recurso-header">
                  <span className={`tipo-badge ${recurso.tipo}`}>
                    {recurso.tipo}
                  </span>
                  <button 
                    onClick={() => handleDelete(recurso.id)}
                    className="delete-button"
                  >
                    ×
                  </button>
                </div>
                <h3>{recurso.titulo}</h3>
                <p>{recurso.descripcion}</p>
                <a 
                  href={recurso.enlace} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="enlace-button"
                >
                  Ver Recurso
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}