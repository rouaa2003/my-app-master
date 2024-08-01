import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCountries } from "../assets/hooks/useCountries";
import "./RegistrationForm.css";

function RegistrationForm({ onClose, onRegisterSuccess, onSwitchToLogin }) {
  const {
    countries,
    cities,
    fetchCities,
    loading,
    error: fetchError,
  } = useCountries();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedCountryId = watch("country");

  useEffect(() => {
    if (selectedCountryId) {
      fetchCities(selectedCountryId);
    }
  }, [selectedCountryId]);

  const onSubmit = async (data) => {
    const { email, phoneNumber, password, fullName, city } = data;

    const registrationData = {
      email,
      phoneNumber,
      password,
      fullName,
      cityId: parseInt(city),
    };

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

      setSuccessMessage(
        "Registration successful! Redirecting to confirmation page..."
      );

      // Close the registration form
      if (onClose) onClose();

      // Redirect to confirmation page after a short delay
      setTimeout(() => {
        navigate("/confirmation");
        if (onRegisterSuccess) onRegisterSuccess();
      }, 2000);
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="registration-form-container">
      <form id="registration-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Register</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {fetchError && <p className="error-message">{fetchError}</p>}

        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" {...field} />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </>
          )}
        />

        <Controller
          name="phoneNumber"
          control={control}
          defaultValue=""
          rules={{ required: "Phone number is required" }}
          render={({ field }) => (
            <>
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input type="text" id="phoneNumber" {...field} />
              {errors.phoneNumber && (
                <p className="error-message">{errors.phoneNumber.message}</p>
              )}
            </>
          )}
        />

        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" {...field} />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </>
          )}
        />

        <Controller
          name="fullName"
          control={control}
          defaultValue=""
          rules={{ required: "Full Name is required" }}
          render={({ field }) => (
            <>
              <label htmlFor="fullName">Full Name:</label>
              <input type="text" id="fullName" {...field} />
              {errors.fullName && (
                <p className="error-message">{errors.fullName.message}</p>
              )}
            </>
          )}
        />

        <Controller
          name="country"
          control={control}
          defaultValue=""
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <>
              <label htmlFor="country">Country:</label>
              <select id="country" {...field}>
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="error-message">{errors.country.message}</p>
              )}
            </>
          )}
        />

        <Controller
          name="city"
          control={control}
          defaultValue=""
          rules={{ required: "City is required" }}
          render={({ field }) => (
            <>
              <label htmlFor="city">City:</label>
              <select id="city" {...field} disabled={!selectedCountryId}>
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="error-message">{errors.city.message}</p>
              )}
            </>
          )}
        />

        <button type="submit" disabled={loading}>
          Register
        </button>
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
