import "../../styles/configperfilest/ProfilePhoto.css";

export default function ProfilePhoto() {
  return (
    <div className="profile-photo">
      <img src="imagenes/usuario.png" alt="Foto de perfil" id="profile-image" />
      <button className="upload-photo-btn">Elige una foto</button>
    </div>
  );
}
