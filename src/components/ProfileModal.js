import React, { useState } from "react";
import "./ProfileModal.css";

function ProfileModal({ onClose, emailAddress, fullName }) {
  
  // const [file, setFile] = useState(null);

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       setProfileImage(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <div id="profileModal" className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Profile Details</h2>
        
        <input
          type="file"
          id="fileInput"
         
          style={{ display: "none" }}
        />
        <p style={{ fontSize: "20px" }}>Name: {fullName}</p>
        <p>{emailAddress}</p>
        <p>Location: New York, USA</p>
      </div>
    </div>
  );
}

export default ProfileModal;
