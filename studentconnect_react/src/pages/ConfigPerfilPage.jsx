import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePhoto from '../componenetes/configperfilest/ProfilePhoto';
import '../styles/configperfilest/config.css';

const ConfigPerfilPage = () => {
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

  const handleHabilidad = (e) => {
    e.preventDefault();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación de campos requeridos
    if (!formData.carrera || !formData.semestre) {
      setError('¡Carrera y semestre son campos obligatorios!');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('carrera', formData.carrera);
    data.append('semestre', formData.semestre.toString()); // Asegurar que sea string
    data.append('especialidad', formData.especialidad);
    data.append('habilidades', JSON.stringify(formData.habilidades));
    
    if (formData.foto) data.append('foto', formData.foto);
    formData.certificados.forEach(cert => data.append('certificado', cert));

    try {
    const response = await API.post('/profile/setup', data);
    
    if (response.data.success) {
      window.location.href = '/dashboard'; // Redirección forzada
    }
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Error desconocido';
    console.error("Detalles del error:", {
      response: error.response,
      request: error.request
    });
    setError(`Error: ${errorMessage}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="profile-config-container">
      <h2>Completa Tu Perfil</h2>
      <p className="setup-subtitle">Por favor completa esta información para continuar</p>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Sección Foto de Perfil */}
        <div className="form-section">
          <h3>Foto de Perfil</h3>
          <ProfilePhoto
            fotoUrl={preview}
            onPhotoChange={handlePhotoChange}
            editable
            required
          />
        </div>

        {/* Sección Información Académica */}
        <div className="form-section">
          <h3>Información Académica</h3>
          
          <div className="form-group">
            <label>Carrera: <span className="required">*</span></label>
            <input
              type="text"
              value={formData.carrera}
              onChange={(e) => setFormData({...formData, carrera: e.target.value})}
              placeholder="Ej: Ingeniería de Software"
              required
            />
          </div>

          <div className="form-group">
            <label>Semestre: <span className="required">*</span></label>
            <input
              type="number"
              value={formData.semestre}
              onChange={(e) => setFormData({...formData, semestre: e.target.value})}
              min="1"
              max="12"
              required
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
              placeholder="Ej: React, Node.js, Diseño UI"
              onKeyPress={(e) => e.key === 'Enter' && handleHabilidad(e)}
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

        {/* Sección Certificados (Opcional) */}
        <div className="form-section">
          <h3>Certificados (Opcional)</h3>
          
          <div className="certificates-input-container">
            <input
              type="file"
              multiple
              onChange={(e) => setFormData(prev => ({
                ...prev,
                certificados: [...prev.certificados, ...Array.from(e.target.files)]
              }))}
              accept="application/pdf"
              id="certificate-input"
            />
            <label htmlFor="certificate-input" className="custom-file-upload">
              <i className="fas fa-upload"></i> Seleccionar Archivos
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
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Guardando...
            </>
          ) : (
            'Finalizar Configuración'
          )}
        </button>
      </form>
    </div>
  );
};

export default ConfigPerfilPage;