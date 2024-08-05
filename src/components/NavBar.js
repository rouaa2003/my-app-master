import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPlus,
  faUserCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./NavBar.css";

function NavBar({
  isAuthenticated,
  isGuest,
  onAddProductClick,
  onProfileClick,
  onLoginClick,
  onRegisterClick,
  onLogout,
}) {
  console.log(isAuthenticated, "isAuthenticated");
  return (
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
          <button className="nav-button login-button" onClick={onLoginClick}>
            Login
          </button>
          <button
            className="nav-button register-button"
            onClick={onRegisterClick}
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
          <button className="nav-button logout-button" onClick={onLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </>
      )}
    </nav>
  );
}

export default NavBar;
