import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPlus,
  faUserCircle,
  faSignOutAlt,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import LoginForm from "./LoginForm"; // Import your LoginForm component
import RegistrationForm from "./RegistrationForm"; // Import your RegistrationForm component
import "./NavBar.css";

function NavBar({
  isAuthenticated,
  onAddProductClick,
  onProfileClick,
  onLogout,
}) {
  const [showForm, setShowForm] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const handleLoginClick = () => {
    setIsLoggingIn(true);
    setShowForm(true);
  };

  const handleRegisterClick = () => {
    setIsLoggingIn(false);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSwitchForm = () => {
    setIsLoggingIn(!isLoggingIn);
  };

  return (
    <>
      <nav>
        <h1 className="nav-p">Blue Market</h1>
        <button
          className="nav-button"
          onClick={() =>
            document
              .getElementById("header")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          <FontAwesomeIcon icon={faHome} />
        </button>

        {!isAuthenticated ? (
          <>
            <button
              className="nav-button login-button"
              onClick={handleLoginClick}
            >
              Login
            </button>
            <button
              className="nav-button register-button"
              onClick={handleRegisterClick}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button
              id="add-product-button"
              className="add-product-button"
              onClick={onAddProductClick}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              id="profileButton"
              className="nav-button"
              onClick={onProfileClick}
            >
              <FontAwesomeIcon icon={faUserCircle} />
            </button>
            <button className="nav-button" onClick={onLogout}>
              <FontAwesomeIcon icon={faComments} />
            </button>
            <button className="nav-button logout-button" onClick={onLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </>
        )}
      </nav>

      {showForm && (
        <div className="form-overlay">
          <div className="form-wrapper">
            {isLoggingIn ? (
              <LoginForm
                onClose={handleCloseForm}
                onSwitchToRegister={handleSwitchForm}
              />
            ) : (
              <RegistrationForm
                onClose={handleCloseForm}
                onSwitchToLogin={handleSwitchForm}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
