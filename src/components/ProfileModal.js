import React, { useState } from 'react';
import './ProfileModal.css';

function ProfileModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [profileImage, setProfileImage] = useState('ProfilePicture.jpg');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="profileModal" className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Profile Details</h2>
        <div className="profile-pic" id="profilePic" onClick={() => document.getElementById('fileInput').click()}>
          <img src={profileImage} className="profile-image" alt="Profile" />
        </div>
        <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        <p style={{ fontSize: '20px' }}>Name: John Doe</p>
        <p>Email: johndoe@example.com</p>
        <p>Location: New York, USA</p>
      </div>
    </div>
  );
}

export default ProfileModal;
