import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePhoto from '../componenetes/configperfilest/ProfilePhoto';
import '../styles/configperfilest/config.css';

const ProfileConfig = () => {
  const [formData, setFormData] = useState({
    carrera: '',
    semestre: '',
    especialidad: '',
    habilidades: [],
    nuevaHabilidad: '',
    foto: null,
    certificados: []
  });

  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Error cargando perfil');
        
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          carrera: data.carrera || '',
          semestre: data.semestre || '',
          especialidad: data.especialidad || '',
          habilidades: data.habilidades || [],
          foto: data.foto_perfil || null
        }));
        setPreview(data.foto_perfil || '');
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar el perfil');
      }
    };

    fetchProfileData();
  }, []);

  const handleHabilidad = () => {
    if (formData.nuevaHabilidad.trim()) {
      setFormData(prev => ({
        ...prev,
        habilidades: [...prev.habilidades, prev.nuevaHabilidad.trim()],
        nuevaHabilidad: ''
      }));
    }
  };

  const removeHabilidad = (index) => {
    setFormData(prev => ({
      ...prev,
      habilidades: prev.habilidades.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoChange = (file) => {
    if (file) {
      setFormData(prev => ({ ...prev, foto: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCertificates = (files) => {
    setFormData(prev => ({
      ...prev,
      certificados: [...prev.certificados, ...Array.from(files)]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('carrera', formData.carrera);
    data.append('semestre', formData.semestre);
    data.append('especialidad', formData.especialidad);
    data.append('habilidades', JSON.stringify(formData.habilidades));
    
    if (formData.foto) data.append('foto', formData.foto);
    formData.certificados.forEach(cert => data.append('certificado', cert));

    try {
      const response = await fetch('http://localhost:3000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || 'Error al actualizar');

      navigate('/perfil', { state: { success: true } });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al guardar cambios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-config-container">
      <h2>Configuración de Perfil</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Sección Foto de Perfil */}
        <div className="form-section">
          <h3>Foto de Perfil</h3>
          <ProfilePhoto
            fotoUrl={preview}
            onPhotoChange={handlePhotoChange}
            editable
          />
        </div>

        {/* Sección Información Académica */}
        <div className="form-section">
          <h3>Información Académica</h3>
          
          <div className="form-group">
            <label>Carrera:</label>
            <input
              type="text"
              value={formData.carrera}
              onChange={(e) => setFormData({...formData, carrera: e.target.value})}
              placeholder="Ej: Ingeniería de Software"
            />
          </div>

          <div className="form-group">
            <label>Semestre:</label>
            <input
              type="number"
              value={formData.semestre}
              onChange={(e) => setFormData({...formData, semestre: e.target.value})}
              min="1"
              max="12"
            />
          </div>

          <div className="form-group">
            <label>Especialidad:</label>
            <input
              type="text"
              value={formData.especialidad}
              onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
              placeholder="Ej: Desarrollo Web"
            />
          </div>
        </div>

        {/* Sección Habilidades */}
        <div className="form-section">
          <h3>Habilidades</h3>
          
          <div className="skills-input-container">
            <input
              type="text"
              value={formData.nuevaHabilidad}
              onChange={(e) => setFormData({...formData, nuevaHabilidad: e.target.value})}
              placeholder="Añade una nueva habilidad"
              onKeyPress={(e) => e.key === 'Enter' && handleHabilidad()}
            />
            <button
              type="button"
              onClick={handleHabilidad}
              className="add-skill-button"
            >
              Agregar
            </button>
          </div>

          <div className="skills-tags-container">
            {formData.habilidades.map((habilidad, index) => (
              <div key={index} className="skill-tag">
                {habilidad}
                <button
                  type="button"
                  onClick={() => removeHabilidad(index)}
                  className="remove-skill-button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Certificados */}
        <div className="form-section">
          <h3>Certificados</h3>
          
          <div className="certificates-input-container">
            <input
              type="file"
              multiple
              onChange={(e) => handleCertificates(e.target.files)}
              accept="application/pdf"
              id="certificate-input"
            />
            <label htmlFor="certificate-input" className="custom-file-upload">
              Seleccionar Archivos PDF
            </label>
            
            <div className="selected-certificates">
              {formData.certificados.map((cert, index) => (
                <div key={index} className="certificate-item">
                  <span>{cert.name}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      certificados: prev.certificados.filter((_, i) => i !== index)
                    }))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default ProfileConfig;