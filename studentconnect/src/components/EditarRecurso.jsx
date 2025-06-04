import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import recursoService from '../services/recursoService';
import '../styles/components/EditarRecurso.css'

const EditarRecurso = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    enlace: '',
    tipo: ''
  });

  useEffect(() => {
  const cargarRecurso = async () => {
    try {
      const recurso = await recursoService.obtenerRecursoPorId(id);

      setFormulario({
        titulo: recurso.titulo || '',
        descripcion: recurso.descripcion || '',
        enlace: recurso.enlace_url || '',
        tipo: recurso.tipo_recurso || ''
      });
    } catch (err) {
      console.error("Error al cargar recurso:", err);
      alert("No se pudo cargar el recurso.");
      navigate('/dashboard');
    }
  };

  cargarRecurso();
}, [id, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recursoService.actualizarRecurso(id, formulario);
      alert("Recurso actualizado correctamente");
      navigate('/dashboard');
    } catch (err) {
      console.error("Error al actualizar recurso:", err);
      alert("Error al actualizar el recurso.");
    }
  };

  return (
    <div className="formulario-container">
      <h2>Editar Recurso</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input type="text" name="titulo" value={formulario.titulo} onChange={handleChange} required />
        </label>

        <label>
          Descripción:
          <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} required />
        </label>

        <label>
          Enlace:
          <input type="url" name="enlace" value={formulario.enlace} onChange={handleChange} required />
        </label>

        <label>
          Tipo:
          <select name="tipo" value={formulario.tipo} onChange={handleChange} required>
            <option value="">Selecciona</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="link">Enlace</option>
          </select>
        </label>

        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarRecurso;
