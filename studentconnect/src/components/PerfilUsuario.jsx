import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/PerfilUsuario.css';

const PerfilUsuario = () => {
  const navigate = useNavigate();
  
  // Estado inicial con datos mock (serán reemplazados por datos reales del backend)
  const [userData, setUserData] = useState({
    nombre_completo: 'Cargando...',
    correo: 'Cargando...',
    carrera: 'Cargando...',
    semestre: 'Cargando...',
    telefono: 'Cargando...',
    avatar: null
  });

  // Simulamos la carga de datos (en producción esto vendrá del backend)
  useEffect(() => {
    // TODO: Reemplazar con llamada real al backend
    const fetchUserData = async () => {
      // Simulamos un retraso de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos mock - en producción estos vendrán de una API
      const mockUserData = {
        nombre_completo: 'Osiel Modesto Modesto',
        correo: 'mods35go@gmail.com',
        carrera: 'Ingeniería en Sistemas',
        semestre: '8vo Semestre',
        telefono: '+52 55 1234 5678',
        avatar: null
      };
      
      setUserData(mockUserData);
    };

    fetchUserData();
  }, []);

  // Función para manejar cambios cuando se implemente la edición
  const handleInputChange = (e) => {
    // TODO: Implementar lógica de actualización cuando se conecte al backend
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para regresar al dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Ajusta la ruta según tu configuración
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={handleBackToDashboard} className="back-button">
          &larr; Volver al Dashboard
        </button>
        <h2>Mi Perfil</h2>
        <div className="profile-avatar">
          {userData.avatar ? (
            <img src={userData.avatar} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              {userData.nombre_completo.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-field">
          <label htmlFor="fullName">Nombre completo</label>
          <input
            type="text"
            id="nombre_completo"
            name="nombre_completo"
            value={userData.nombre_completo}
            onChange={handleInputChange}
            readOnly // Temporal hasta implementar edición
          />
        </div>

        <div className="profile-field">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={userData.correo}
            onChange={handleInputChange}
            readOnly
          />
        </div>

        <div className="profile-field-group">
          <div className="profile-field">
            <label htmlFor="career">Carrera</label>
            <input
              type="text"
              id="carrera"
              name="carrera"
              value={userData.carrera}
              onChange={handleInputChange}
              readOnly
            />
          </div>

          <div className="profile-field">
            <label htmlFor="semester">Semestre</label>
            <input
              type="text"
              id="semestre"
              name="semestre"
              value={userData.semestre}
              onChange={handleInputChange}
              readOnly
            />
          </div>
        </div>

        <div className="profile-field">
          <label htmlFor="phone">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={userData.telefono}
            onChange={handleInputChange}
            readOnly
          />
        </div>
      </div>

      {/* TODO: Implementar botones de acción cuando se conecte al backend */}
      <div className="profile-actions">
        <button className="edit-button" disabled>
          Editar Perfil
        </button>
        <button className="save-button" disabled>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default PerfilUsuario;