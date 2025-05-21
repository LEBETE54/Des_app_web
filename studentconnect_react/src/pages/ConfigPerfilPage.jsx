import ProfilePhoto from "../componenetes/configperfilest/ProfilePhoto";
import FormGrid from "../componenetes/configperfilest/FormGrid";
import SkillsInput from "../componenetes/configperfilest/SkillsInput";
import UploadsSection from "../componenetes/configperfilest/UploadsSection";
import SubmitButton from "../componenetes/configperfilest/SubmitButton";
import "../styles/configperfilest/global.css";

export default function ConfigPerfilPage() {
  return (
    <div className="container">
      <h2 className="section-title">Configuración del perfil</h2>
      <div className="profile-settings">
        <ProfilePhoto />
        <FormGrid />
        <SkillsInput />
        <UploadsSection />
        <SubmitButton />
      </div>
    </div>
  );
}
