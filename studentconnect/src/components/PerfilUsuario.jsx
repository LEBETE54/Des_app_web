import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usuarioService from '../services/usuarioService';
import useAuthStore from '../store/authStore'; // Para obtener el ID del usuario
import '../styles/components/PerfilUsuario.css';

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const userId = user?.id;

  const [userData, setUserData] = useState({
    nombre_completo: '',
    correo: '',
    carrera: '',
    semestre: '',
    telefono: '',
    avatar: null
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const data = await usuarioService.obtenerPerfilUsuario(userId);
        setUserData(data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      await usuarioService.actualizarPerfilUsuario(userId, userData);
      alert("Perfil actualizado con éxito.");
      setEditMode(false);
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      alert("Hubo un problema al actualizar tu perfil.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          &larr; Volver al Dashboard
        </button>
        <h2>Mi Perfil</h2>
        <div className="profile-avatar">
          {userData.avatar ? (
            <img src={userData.avatar} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              {userData.nombre_completo?.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
      </div>

      <div className="profile-details">
        {['nombre_completo', 'correo', 'carrera', 'semestre', 'telefono'].map((field) => (
          <div className="profile-field" key={field}>
            <label htmlFor={field}>
              {field.replace('_', ' ').replace(/^./, str => str.toUpperCase())}
            </label>
            <input
              type={field === 'correo' ? 'email' : 'text'}
              id={field}
              name={field}
              value={userData[field]}
              onChange={handleInputChange}
              readOnly={!editMode || field === 'correo'} // No permitir cambiar correo
            />
          </div>
        ))}
      </div>

      <div className="profile-actions">
        {!editMode ? (
          <button className="edit-button" onClick={() => setEditMode(true)}>
            Editar Perfil
          </button>
        ) : (
          <>
            <button className="save-button" onClick={handleGuardar}>
              Guardar Cambios
            </button>
            <button className="edit-button" onClick={() => setEditMode(false)}>
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PerfilUsuario;