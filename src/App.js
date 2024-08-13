import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import AddProductForm from "./components/AddProductForm";
import ProfileModal from "./components/ProfileModal";

import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import LandingPage from "./components/LandingPage";
import ConfirmationPage from "./components/ConfirmationPage";
import "./App.css";

function App() {
  const [isAddProductOpen, setAddProductOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [authStateChange, setAuthStateChange] = useState(0);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const [currentUserId, setcurrentUserId] = useState("");
  const [authToken, setauthToken] = useState("");

  const navigate = useNavigate();

  console.log("isAuthenticated", isAuthenticated, "isGuest", isGuest);

  useEffect(() => {}, [isAuthenticated, isGuest]);

  // Function to check if the user is authenticated
  const checkAuthentication = () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const newAuthState = !!token;

    setauthToken(token);
    setcurrentUserId(userId);
    console.log("Checking authentication. Token exists:", newAuthState);
    setIsAuthenticated(newAuthState);
  };

  const handleSignIn = () => {
    console.log("handleSignIn called");
    checkAuthentication();
  };

  const handleVisitAsGuest = () => {
    setIsGuest(true);
    setIsAuthenticated(false);
    setAuthStateChange((prev) => {
      console.log(
        "Updating authStateChange in handleVisitAsGuest. New value:",
        prev + 1
      );
      return prev + 1;
    });
  };

  const handleAddProductClick = () => {
    setAddProductOpen(true);
    setProfileOpen(false);

    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
    setAddProductOpen(false);

    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const handleLoginClick = () => {
    setLoginOpen(true);
    setAddProductOpen(false);
    setProfileOpen(false);
    setIsAuthenticated(false);
    setRegisterOpen(false);
  };

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    setIsGuest(false);
    setAuthStateChange((prev) => prev + 1);
    navigate("/main");
  });

  const handleRegisterClick = () => {
    setRegisterOpen(true);
    setAddProductOpen(false);
    setProfileOpen(false);

    setLoginOpen(false);
  };

  const handleRegisterSuccess = () => {
    setRegisterOpen(false);
    checkAuthentication(); // Check authentication after registration
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);

    navigate("/landingPage"); // Navigate to landing page or login page
    window.location.reload();
  };

  const handleSuccessRefetch = () => {
    window.location.reload();
  };

  const handleProductAdded = () => {
    // Trigger a refetch of product data in ProductGrid
    setAuthStateChange((prev) => prev + 1); // This will cause a re-render in ProductGrid
  };
  useEffect(() => {
    console.log("App useEffect triggered. AuthStateChange:", authStateChange);
    checkAuthentication();
  }, [authStateChange, handleLoginSuccess]);

  return (
    <div className="App">
      {isAuthenticated || isGuest ? (
        <>
          <NavBar
            isAuthenticated={isAuthenticated}
            isGuest={isGuest}
            onAddProductClick={handleAddProductClick}
            onProfileClick={handleProfileClick}
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
            onLogout={handleLogout}
            handleLoginSuccess={handleLoginSuccess}
          />
          <Header />
          <main>
            <ProductGrid
              currentUserId={currentUserId}
              isGuest={isGuest}
              isAuthenticated={isAuthenticated}
              authStateChange={authStateChange}
              onLoginSuccess={handleSuccessRefetch}
              onProductAdded={handleProductAdded}
            />
          </main>
          <Footer />
          {(isLoginOpen || isRegisterOpen) && <div className="modal-overlay" />}
          {isAddProductOpen && (
            <AddProductForm
              onClose={() => setAddProductOpen(false)}
              onProductAdded={handleProductAdded}
            />
          )}
          {isProfileOpen && (
            <ProfileModal
              onClose={() => setProfileOpen(false)}
              currentUserId={currentUserId}
              authToken={authToken}
            />
          )}

          {isLoginOpen && (
            <LoginForm
              onClose={() => setLoginOpen(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
          {isRegisterOpen && (
            <RegistrationForm
              onClose={() => setRegisterOpen(false)}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}
        </>
      ) : (
        <LandingPage
          onSignIn={handleSignIn}
          onVisitAsGuest={handleVisitAsGuest}
        />
      )}
      <Routes>
        <Route
          path="/login"
          element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/registration"
          element={
            <RegistrationForm onRegisterSuccess={handleRegisterSuccess} />
          }
        />
        <Route path="/confirmation" element={<ConfirmationPage />} />

        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated || isGuest ? "/main" : "/landingPage"}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
