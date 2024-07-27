import React, { useState } from "react";
import "./LoginForm.css";

function LoginForm({ onClose, onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      localStorage.setItem("authToken", result.token);
      if (onLoginSuccess) onLoginSuccess();
      if (onClose) onClose();
    } catch (error) {
      setError(error.message);
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
