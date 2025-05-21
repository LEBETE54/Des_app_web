import "../../styles/configperfilest/FormGrid.css";

export default function FormGrid() {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label htmlFor="career">Carrera</label>
        <input type="text" id="career" value="Traducción e Interpretación de Idiomas" />
      </div>

      <div className="form-group">
        <label htmlFor="semester">Semestre</label>
        <input type="number" id="semester" value="6" />
      </div>

      <div className="form-group">
        <label htmlFor="category">Categoría</label>
        <select id="category" defaultValue="idiomas">
          <option value="idiomas">Idiomas</option>
          <option value="sistemas">Sistemas</option>
          <option value="desarrollo web">Desarrollo Web</option>
          <option value="administracion">Administración</option>
          <option value="construccion">Construcción</option>
        </select>
      </div>
    </div>
  );
}
