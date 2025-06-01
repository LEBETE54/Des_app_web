import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/AdministracionAsesorias.css';

const AdministracionAsesorias = () => {
  const navigate = useNavigate();
  const [asesoria, setAsesoria] = useState({
    titulo_asesoria: '',
    descripcion_asesoria: '',
    fecha_hora_inicio: '',
    fecha_hora_fin: '',
    modalidad: '',
    enlace_o_lugar: ''
  });
  
  const [alumnosInscritos, setAlumnosInscritos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Simular carga de datos (se reemplazará con backend)
  useEffect(() => {
    const fetchAsesoriaData = async () => {
      // Simular retraso de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Datos mock - reemplazar con llamada a API
      const mockAsesoria = {
        titulo_asesoria: 'Introducción a React Hooks',
        descripcion_asesoria: 'Aprenderemos los fundamentos de los hooks más usados en React',
        fecha_hora_inicio: '2023-11-15T10:00',
        fecha_hora_fin: '2023-11-15T12:00',
        modalidad: 'Virtual',
        enlace_o_lugar: 'https://meet.google.com/xyz-abc-123'
      };
      
      const mockAlumnos = [
        { id: 1, nombre: 'Ana García', carrera: 'Ing Sistemas', correo: 'ana.garcia@universidad.edu' },
        { id: 2, nombre: 'Luis Martínez', carrera: 'Ing Civil', correo: 'luis.martinez@universidad.edu' },
        { id: 3, nombre: 'María Rodríguez', carrera: 'Ing Mecatronica', correo: 'maria.rodriguez@universidad.edu' }
      ];
      
      setAsesoria(mockAsesoria);
      setAlumnosInscritos(mockAlumnos);
    };

    fetchAsesoriaData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAsesoria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteAlumno = (alumnoId) => {
    // TODO: Conectar con backend para eliminar alumno
    setAlumnosInscritos(prev => prev.filter(alumno => alumno.id !== alumnoId));
  };

  const handleSaveChanges = () => {
    // TODO: Conectar con backend para guardar cambios
    console.log('Datos a guardar:', asesoria);
    setIsEditing(false);
    // Aquí iría la llamada a la API
  };

  const handleDeleteAsesoria = () => {
    // TODO: Conectar con backend para eliminar asesoría
    if (window.confirm('¿Estás seguro de que deseas eliminar esta asesoría?')) {
      console.log('Asesoría eliminada');
      navigate('/dashboard'); // Redirigir después de eliminar
    }
  };

  const handleBack = () => {
    navigate(-1); // Regresar a la página anterior
  };

  return (
    <div className="admin-asesorias-container">
        <div className="header-section">
            <button onClick={handleBack} className="back-button">
                &larr; Volver
            </button>
      </div>
      <div className="asesoria-info-section">
        <h2 className="asesoria-tittle">Administración de Asesoría</h2>
        <h3>Información de la Asesoría</h3>
        
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            name="titulo_asesoria"
            value={asesoria.titulo_asesoria}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={isEditing ? 'editable' : ''}
          />
        </div>
        
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion_asesoria"
            value={asesoria.descripcion_asesoria}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={isEditing ? 'editable' : ''}
            rows="4"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Fecha/Hora Inicio</label>
            <input
              type="datetime-local"
              name="fecha_hora_inicio"
              value={asesoria.fecha_hora_inicio}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>
          
          <div className="form-group">
            <label>Fecha/Hora Fin</label>
            <input
              type="datetime-local"
              name="fecha_hora_fin"
              value={asesoria.fecha_hora_fin}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Modalidad</label>
            <select
              name="modalidad"
              value={asesoria.modalidad}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={isEditing ? 'editable' : ''}
            >
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Híbrida">Híbrida</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>{asesoria.modalidad === 'Virtual' ? 'Enlace' : 'Lugar'}</label>
            <input
              type="text"
              name="enlace_o_lugar"
              value={asesoria.enlace_o_lugar}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={isEditing ? 'editable' : ''}
              placeholder={asesoria.modalidad === 'Virtual' ? 'https://...' : 'Aula o lugar físico'}
            />
          </div>
        </div>
      </div>
      
      <div className="alumnos-section">
        <h3>Alumnos Inscritos ({alumnosInscritos.length})</h3>
        
        {alumnosInscritos.length > 0 ? (
          <div className="alumnos-table">
            <div className="table-header">
              <div>Nombre</div>
              <div>Carrera</div>
              <div>Correo</div>
              <div>Acciones</div>
            </div>
            
            {alumnosInscritos.map(alumno => (
              <div key={alumno.id} className="table-row">
                <div>{alumno.nombre}</div>
                <div>{alumno.carrera}</div>
                <div>{alumno.correo}</div>
                <div>
                  <button 
                    onClick={() => handleDeleteAlumno(alumno.id)}
                    className="delete-btn"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay alumnos inscritos en esta asesoría.</p>
        )}
      </div>
      
      <div className="actions-section">
        {!isEditing ? (
          <>
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-btn"
            >
              Editar Asesoría
            </button>
            <button 
              onClick={handleDeleteAsesoria}
              className="delete-btn"
            >
              Eliminar Asesoría
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={handleSaveChanges}
              className="save-btn"
            >
              Guardar Cambios
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="cancel-btn"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdministracionAsesorias;