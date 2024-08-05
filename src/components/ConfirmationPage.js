import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./ConfirmationPage.css";

const ConfirmationPage = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { email, code } = data;

    try {
      const response = await fetch(
        `http://www.product.somee.com/api/User/ConfirmAccount?email=${encodeURIComponent(
          email
        )}&code=${encodeURIComponent(code)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: null, // Since the API expects query parameters, body is not needed
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setSuccessMessage(
        "Account confirmed successfully. Redirecting to login..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleResendEmail = async () => {
    const email = watch("email");

    try {
      const response = await fetch(
        `http://www.product.somee.com/api/User/ResendEmailConfirmCode?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: null,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setSuccessMessage("Confirmation email resent successfully.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    navigate("/");
  };

  if (!isVisible) return null; // Render nothing if not visible

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-page-container">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <h2>Confirm Your Account</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
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
            name="code"
            control={control}
            defaultValue=""
            rules={{ required: "Confirmation code is required" }}
            render={({ field }) => (
              <>
                <label htmlFor="code">Confirmation Code:</label>
                <input type="text" id="code" {...field} />
                {errors.code && (
                  <p className="error-message">{errors.code.message}</p>
                )}
              </>
            )}
          />

          <button type="submit">Confirm Account</button>
        </form>
        <button type="button" onClick={handleResendEmail}>
          Resend Confirmation Email
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
