import "../../styles/configperfilest/SkillsInput.css";

export default function SkillsInput() {
  return (
    <div className="form-group skills-group">
      <label htmlFor="skills">Habilidades</label>
      <div className="skills-input">
        <input type="text" id="skills" placeholder="Ej. chino, japonés" />
        <button className="add-skill-btn">+</button>
      </div>
      <div className="skills-tags">
        <span className="tag">chino tradicional</span>
        <span className="tag">checo</span>
        <span className="tag">chino simplificado</span>
        <span className="tag">japonés</span>
        <span className="tag">inglés</span>
      </div>
    </div>
  );
}
