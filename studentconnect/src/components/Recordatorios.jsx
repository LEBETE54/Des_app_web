import { useEffect, useState } from 'react';
import asesoriaService from '../services/asesoriaService';
import '../styles/components/Recordatorios.css';

const Recordatorios = () => {
  const [recordatorios, setRecordatorios] = useState([]);
  const [nuevoRecordatorio, setNuevoRecordatorio] = useState({
    titulo: '',
    fecha: '',
    hora: '',
    descripcion: ''
  });

  useEffect(() => {
    const cargarRecordatorios = async () => {
      try {
        const recordatoriosData = await asesoriaService.obtenerRecordatorios();
        setRecordatorios(recordatoriosData);
      } catch (err) {
        console.error("Error al cargar recordatorios:", err);
        alert("No se pudieron cargar los recordatorios.");
      }
    };

    cargarRecordatorios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoRecordatorio(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const recordatorioCreado = await asesoriaService.crearRecordatorio(nuevoRecordatorio);
      setRecordatorios([...recordatorios, recordatorioCreado]);
      setNuevoRecordatorio({
        titulo: '',
        fecha: '',
        hora: '',
        descripcion: ''
      });
      alert("Recordatorio agregado correctamente");
    } catch (err) {
      console.error("Error al crear recordatorio:", err);
      alert("Error al crear el recordatorio.");
    }
  };

  const eliminarRecordatorio = async (id) => {
    try {
      await asesoriaService.eliminarRecordatorio(id);
      setRecordatorios(recordatorios.filter(r => r.id !== id));
      alert("Recordatorio eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar recordatorio:", err);
      alert("Error al eliminar el recordatorio.");
    }
  };

  return (
    <div className="recordatorios-container">
      <h2>Agenda de Asesorías</h2>
      
      <div className="lista-recordatorios">
        <h3>Tus próximas asesorías</h3>
        {recordatorios.length === 0 ? (
          <p>No tienes recordatorios programados</p>
        ) : (
          <ul>
            {recordatorios.map((recordatorio) => (
              <li key={recordatorio.id} className="recordatorio-item">
                <div className="recordatorio-info">
                  <h4>{recordatorio.titulo}</h4>
                  <p><strong>Fecha:</strong> {recordatorio.fecha} a las {recordatorio.hora}</p>
                  <p>{recordatorio.descripcion}</p>
                </div>
                <button 
                  onClick={() => eliminarRecordatorio(recordatorio.id)}
                  className="eliminar-btn"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="formulario-recordatorio">
        <h3>Agregar nuevo recordatorio</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input 
              type="text" 
              name="titulo" 
              value={nuevoRecordatorio.titulo} 
              onChange={handleChange} 
              required 
            />
          </label>

          <label>
            Fecha:
            <input 
              type="date" 
              name="fecha" 
              value={nuevoRecordatorio.fecha} 
              onChange={handleChange} 
              required 
            />
          </label>

          <label>
            Hora:
            <input 
              type="time" 
              name="hora" 
              value={nuevoRecordatorio.hora} 
              onChange={handleChange} 
              required 
            />
          </label>

          <label>
            Descripción:
            <textarea 
              name="descripcion" 
              value={nuevoRecordatorio.descripcion} 
              onChange={handleChange} 
              required 
            />
          </label>

          <button type="submit">Agregar Recordatorio</button>
        </form>
      </div>
    </div>
  );
};

export default Recordatorios;