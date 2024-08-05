import React, { useState, useEffect } from "react";
import { Atom } from "react-loading-indicators";
import "./ProfileModal.css";

function ProfileModal({ onClose, currentUserId, authToken }) {
  const [profileData, setProfileData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        try {
          const response = await fetch(
            `http://www.product.somee.com/api/User/GetUserProfileInfo?userId=${currentUserId}`,
            {
              method: "GET",
              headers: {
                Authorization: authToken,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result = await response.json();
          console.log("Profile data fetched:", result); // Debugging line
          setProfileData(result.data);
          setIsLoading(false); // Data is loaded, so set loading to false
        } catch (error) {
          console.error("Error fetching profile data:", error);
          setIsLoading(false); // Ensure loading state is turned off even if there's an error
        }
      } catch (error) {
        console.error("Error during profile data fetch:", error);
        setIsLoading(false); // Ensure loading state is turned off on error
      }
    };

    fetchProfileData();
    setIsVisible(true);

    // Cleanup function to hide modal
    return () => {
      setIsVisible(false);
    };
  }, [currentUserId, authToken]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow time for animation to complete before calling onClose
  };

  return (
    <div id="profileModal" className={`modal ${isVisible ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <h2>Profile Details</h2>
        {isLoading ? (
          <div className="loading-container">
            <Atom
              color="#314acc"
              size="large"
              text="Loading..."
              textColor="#314acc"
            />
          </div>
        ) : (
          <div className="profile-info">
            <p>
              <span>Name:</span> {profileData?.fullName || "N/A"}
            </p>
            <p>
              <span>Contact Number:</span> {profileData?.phoneNumber || "N/A"}
            </p>
            <p>
              <span>Location:</span> {profileData?.city?.name || "N/A"}
            </p>
            <p>
              <span>Rating:</span> {profileData?.rating || "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;
