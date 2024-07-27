// src/components/LandingPage.js

import React, { useState } from "react";
import "./LandingPage.css"; // Ensure you create and include this stylesheet
import myImage from "../assets/image/_b711def7-f357-4078-b253-da9862828abd.jpg"; // Update the path to your image
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

const LandingPage = ({ onSignIn, onVisitAsGuest }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const handleSignIn = () => {
    setShowForm(true);
    setIsLoggingIn(true);
  };

  const handleSignUp = () => {
    setShowForm(true);
    setIsLoggingIn(false);
  };

  const handleVisitAsGuest = () => {
    onVisitAsGuest();
  };

  const handleToggleForm = () => {
    setIsLoggingIn(!isLoggingIn);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className={`landing-page ${showForm ? "blur-background" : ""}`}>
      <div className="content">
        <div className="container">
          <div className="left">
            <h1>
              Welcome to <br />
              the Blue Market
            </h1>
            <p>
              This is where we meet, choose, sell, and buy all kinds of things.{" "}
              <br />
              Please log in to your account if you already have one or sign up
              if you don't, or you can easily visit our website as a guest.
            </p>
            <div className="button-container">
              <button className="visit-btn" onClick={handleVisitAsGuest}>
                Visit as a Guest
              </button>
              <button className="auth-btn" onClick={handleSignIn}>
                Sign In
              </button>
              <button className="auth-btn" onClick={handleSignUp}>
                Sign Up
              </button>
            </div>
          </div>
          <div className="right">
            <img
              src={myImage}
              alt="A photo for people exchanging their materials"
            />
          </div>
        </div>
      </div>
      {showForm && (
        <div className="form-overlay">
          <div className="form-wrapper">
            {isLoggingIn ? (
              <LoginForm
                onClose={handleCloseForm}
                onLoginSuccess={onSignIn}
                onSwitchToRegister={handleToggleForm}
              />
            ) : (
              <RegistrationForm
                onClose={handleCloseForm}
                onRegisterSuccess={onSignIn}
                onSwitchToLogin={handleToggleForm}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
