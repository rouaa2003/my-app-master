import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPlus,
  faUserCircle,
  faComments,
  faFilter,
  faSearch,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./NavBar.css";

function NavBar({
  isAuthenticated,
  onAddProductClick,
  onProfileClick,
  onChatToggle,
  onLoginClick,
  onRegisterClick,
  onLogout,
}) {
  return (
    <nav>
      <h1 className="nav-p">Blue Market</h1>
      <button
        className={`nav-button`}
        onClick={() =>
          document
            .getElementById("header")
            .scrollIntoView({ behavior: "smooth" })
        }
      >
        <FontAwesomeIcon icon={faHome} />
      </button>
      <button className={`nav-button`} onClick={() => onChatToggle("filter")}>
        <FontAwesomeIcon icon={faFilter} />
      </button>
      <div className="nav-search">
        <input type="text" placeholder="Search..." />
        <button type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
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
      <button
        className={`nav-button chat-icon`}
        id="chat-toggle"
        onClick={onChatToggle}
        style={{ marginRight: "30px" }}
      >
        <FontAwesomeIcon icon={faComments} />
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
        <button className="nav-button logout-button" onClick={onLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      )}
    </nav>
  );
}

export default NavBar;
