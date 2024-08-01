import React, { useState } from "react";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";

function LoginForm({ onClose, onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate hook

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch(
        "http://www.product.somee.com/api/User/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage =
          errorResponse.errorMessage || "An unknown error occurred";
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("res", result);
      const token = result.data.token;
      const userId = result.data.id;
      const fullName = result.data.fullName;
      const userName = result.data.userName;
      const ProfilePic = result.data.imageUrl;

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("userName", userName);
        localStorage.setItem("ProfilePic", ProfilePic);

        if (onLoginSuccess) onLoginSuccess();
        if (onClose) onClose();
        navigate("/main"); // Navigate to main page after login
      } else {
        throw new Error("Token not found in the response");
      }
    } catch (error) {
      setError(error.message); // Set the error state to display the message
    }
  };

  return (
    <div className="login-form-container">
      <form id="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
      <button className="switch-form-btn" onClick={onSwitchToRegister}>
        Don't have an account? Sign up now
      </button>
    </div>
  );
}

export default LoginForm;
