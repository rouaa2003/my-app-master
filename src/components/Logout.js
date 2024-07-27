import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use this for navigation

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user authentication data
    localStorage.removeItem("authToken");

    // Optionally, clear other data like user profile, cart items, etc.
    // localStorage.removeItem("userProfile");
    // localStorage.removeItem("cartItems");

    // Redirect to the login page or home page
    navigate("/login"); // Adjust this route as needed
  }, [navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
