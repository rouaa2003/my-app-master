import React, { useState } from "react";
import "./RegistrationForm.css";

function RegistrationForm({ onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [cityId, setCityId] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const registrationData = { email, phoneNumber, password, fullName, cityId };

    try {
      const response = await fetch(
        "http://www.product.somee.com/api/User/CreateUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (onRegisterSuccess) onRegisterSuccess();
      if (onClose) onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="registration-form-container">
      <form id="registration-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
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
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <label htmlFor="cityId">City ID:</label>
        <input
          type="number"
          id="cityId"
          name="cityId"
          value={cityId}
          onChange={(e) => setCityId(parseInt(e.target.value))}
          required
        />
        <button type="submit">Register</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
      <button className="switch-form-btn" onClick={onSwitchToLogin}>
        Already have an account? Login instead
      </button>
    </div>
  );
}

export default RegistrationForm;
