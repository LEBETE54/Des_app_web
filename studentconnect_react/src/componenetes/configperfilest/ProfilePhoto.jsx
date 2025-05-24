import React from 'react';
import '../../styles/configperfilest/ProfilePhoto.css';

const ProfilePhoto = ({ fotoUrl, onPhotoChange, editable = false }) => {
  const handlePhotoClick = () => {
    if (editable) {
      document.getElementById('profile-photo-input').click();
    }
  };

  return (
    <div className="profile-photo-container">
      <div 
        className={`profile-photo ${editable ? 'editable' : ''}`} 
        onClick={handlePhotoClick}
      >
        {fotoUrl ? (
          <img src={fotoUrl} alt="Foto de perfil" />
        ) : (
          <div className="empty-photo">
            <i className="fa-solid fa-user"></i>
          </div>
        )}
      </div>
      
      {editable && (
        <input
          id="profile-photo-input"
          type="file"
          accept="image/*"
          onChange={(e) => onPhotoChange(e.target.files[0])}
          hidden
        />
      )}
    </div>
  );
};

export default ProfilePhoto;