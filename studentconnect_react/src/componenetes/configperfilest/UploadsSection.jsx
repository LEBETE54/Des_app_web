import "../../styles/configperfilest/UploadsSection.css";

export default function UploadsSection() {
  return (
    <div className="uploads-section">
      <div className="upload-box">
        <label>Tus certificaciones</label>
        <div className="upload-area">
          <span>Sube tus certificaciones</span>
          <input type="file" />
        </div>
      </div>
      <div className="upload-box">
        <label>Proyectos en los que has trabajado</label>
        <div className="upload-area">
          <span>Sube las imágenes de tu proyecto</span>
          <input type="file" />
        </div>
      </div>
    </div>
  );
}
