import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import asesoriaAdminService from '../services/asesoriaAdminService';
import materiaService from '../services/materiaService'; 
import '../styles/components/AdministracionAsesorias.css';
import useAuthStore from '../store/authStore'; 


const AdministracionAsesorias = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const userId = user?.id;
  const [asesoria, setAsesoria] = useState({
    titulo_asesoria: '',
    descripcion_asesoria: '',
    fecha_hora_inicio: '',
    fecha_hora_fin: '',
    modalidad: '',
    materia_id: '',
    enlace_o_lugar: ''


  });
  const [materias, setMaterias] = useState([]);
  const [alumnosInscritos, setAlumnosInscritos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const { asesoria, alumnos } = await asesoriaAdminService.obtenerAsesoriaPorId(userId);
      setAsesoria(asesoria);
      setAlumnosInscritos(alumnos);
      const materiasData = await materiaService.obtenerTodasLasMaterias();
      setMaterias(materiasData);
      } catch (error) {
      console.error('Error al cargar datos:', error);
    }
    };

    fetchData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAsesoria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await asesoriaAdminService.actualizarAsesoria(userId, asesoria);
      alert("Cambios guardados con éxito");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al guardar los cambios.");
    }
  };

  const handleDeleteAsesoria = async () => {
    if (window.confirm("¿Seguro que deseas eliminar esta asesoría?")) {
      try {
        await asesoriaAdminService.eliminarAsesoria(userId);
        alert("Asesoría eliminada");
        navigate('/dashboard');
      } catch (error) {
        console.error("Error al eliminar asesoría:", error);
        alert("No se pudo eliminar la asesoría");
      }
    }
  };

  const handleDeleteAlumno = async (alumnoId) => {
    try {
      await asesoriaAdminService.eliminarAlumnoDeAsesoria(userId, alumnoId);
      setAlumnosInscritos(prev => prev.filter(alumno => alumno.id !== alumnoId));
    } catch (error) {
      console.error("Error al eliminar alumno:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="admin-asesorias-container">
      <div className="header-section">
        <button onClick={handleBack} className="back-button">&larr; Volver</button>
      </div>

      <div className="asesoria-info-section">
        <h2 className="asesoria-tittle">Administración de Asesoría</h2>
        <h3>Información de la Asesoría</h3>

        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            name="titulo_asesoria"
            value={asesoria.titulo_asesoria || ''}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={isEditing ? 'editable' : ''}
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion_asesoria"
            value={asesoria.descripcion_asesoria || ''}
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
              value={asesoria.fecha_hora_inicio?.slice(0, 16) || ''}
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
              value={asesoria.fecha_hora_fin?.slice(0, 16) || ''}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>
        </div>

          <div className="form-group">
          <label htmlFor="materiaId">Materia Principal (opcional):</label>
          <select
          id="materiaId"
          name="materia_id"
          value={asesoria.materia_id || ''}
          onChange={handleInputChange}
          disabled={!isEditing || materias.length === 0}
          className={isEditing ? 'editable' : ''}
          >
    <option value="">-- General / Varias --</option>
    {materias.map((m) => (
      <option key={m.id} value={m.id}>
        {m.nombre_materia || m.nombre}
      </option>
    ))}
  </select>
  {materias.length === 0 && !isEditing && (
    <small>No hay materias cargadas.</small>
  )}
</div>



        <div className="form-row">
          <div className="form-group">
            <label>Modalidad</label>
            <select
              name="modalidad"
              value={asesoria.modalidad || ''}
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
              value={asesoria.enlace_o_lugar || ''}
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
                  <button onClick={() => handleDeleteAlumno(alumno.id)} className="delete-btn">
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
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Editar Asesoría
            </button>
            <button onClick={handleDeleteAsesoria} className="delete-btn">
              Eliminar Asesoría
            </button>
          </>
        ) : (
          <>
            <button onClick={handleSaveChanges} className="save-btn">
              Guardar Cambios
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdministracionAsesorias;
