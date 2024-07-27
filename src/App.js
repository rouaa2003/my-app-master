import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import AddProductForm from "./components/AddProductForm";
import ProfileModal from "./components/ProfileModal";
import ChatContainer from "./components/ChatContainer";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Logout from "./components/Logout";
import LandingPage from "./components/LandingPage"; // Import LandingPage
import "./App.css";

function App() {
  const [isAddProductOpen, setAddProductOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuthentication = () => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleSignIn = () => {
    checkAuthentication();
  };

  const handleVisitAsGuest = () => {
    setIsAuthenticated(true); // Allow guest access
  };

  const handleAddProductClick = () => {
    setAddProductOpen(true);
    setProfileOpen(false);
    setChatOpen(false);
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
    setAddProductOpen(false);
    setChatOpen(false);
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const handleChatToggle = () => {
    setChatOpen((prev) => !prev);
    setAddProductOpen(false);
    setProfileOpen(false);
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const handleLoginClick = () => {
    setLoginOpen(true);
    setAddProductOpen(false);
    setProfileOpen(false);
    setChatOpen(false);
    setRegisterOpen(false);
  };

  const handleRegisterClick = () => {
    setRegisterOpen(true);
    setAddProductOpen(false);
    setProfileOpen(false);
    setChatOpen(false);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login"); // Navigate to login or home page
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <NavBar
            isAuthenticated={isAuthenticated}
            onAddProductClick={handleAddProductClick}
            onProfileClick={handleProfileClick}
            onChatToggle={handleChatToggle}
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
            onLogout={handleLogout}
          />
          <Header isChatOpen={isChatOpen} />
          <main
            className={`main-content ${
              isLoginOpen || isRegisterOpen ? "blur-effect" : ""
            }`}
          >
            <ProductGrid isChatOpen={isChatOpen} />
          </main>
          <Footer />
          {(isLoginOpen || isRegisterOpen) && <div className="modal-overlay" />}
          {isAddProductOpen && (
            <AddProductForm onClose={() => setAddProductOpen(false)} />
          )}
          {isProfileOpen && (
            <ProfileModal onClose={() => setProfileOpen(false)} />
          )}
          {isChatOpen && <ChatContainer isOpen={isChatOpen} />}
          {isLoginOpen && (
            <LoginForm
              onClose={() => setLoginOpen(false)}
              onLoginSuccess={checkAuthentication}
            />
          )}
          {isRegisterOpen && (
            <RegistrationForm
              onClose={() => setRegisterOpen(false)}
              onRegisterSuccess={checkAuthentication}
            />
          )}
          <Routes>
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </>
      ) : (
        <LandingPage
          onSignIn={handleSignIn}
          onVisitAsGuest={handleVisitAsGuest}
        />
      )}
    </div>
  );
}

export default App;
