// ProductActions.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./ProductActions.css";

function ProductActions({
  product,
  currentUserId,
  isGuest,
  handleChatClick,
  handleDeleteProduct,
  handleMarkAsSold,
}) {
  const [hasRated, setHasRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [showRatingConfirmation, setShowRatingConfirmation] = useState(false);

  const [hoverRating, setHoverRating] = useState(0);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    // Check if the user has already rated this seller
    const ratedSellers = JSON.parse(
      localStorage.getItem("ratedSellers") || "{}"
    );
    setHasRated(!!ratedSellers[product.user.id]);
  }, [product.user.id]);

  const handleRatingClick = (selectedRating) => {
    if (!hasRated) {
      setRating(selectedRating);
    }
  };

  const handleRatingHover = (hoveredRating) => {
    if (!hasRated) {
      setHoverRating(hoveredRating);
    }
  };

  const handleRatingLeave = () => {
    if (!hasRated) {
      setHoverRating(0);
    }
  };

  const getRatingValue = (stars) => {
    switch (stars) {
      case 5:
        return 85;
      case 4:
        return 70;
      case 3:
        return 50;
      case 2:
        return 35;
      case 1:
        return 20;
      default:
        return 0;
    }
  };

  const submitRating = async () => {
    if (rating === 0) return;

    const ratingValue = getRatingValue(rating);

    try {
      const response = await fetch(
        `http://www.product.somee.com/api/User/UpdateRating?userId=${product.user.id}&rate=${ratingValue}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        // Update local storage to mark this seller as rated
        const ratedSellers = JSON.parse(
          localStorage.getItem("ratedSellers") || "{}"
        );
        ratedSellers[product.user.id] = true;
        localStorage.setItem("ratedSellers", JSON.stringify(ratedSellers));

        setHasRated(true);
        setShowRatingConfirmation(true);
        setTimeout(() => setShowRatingConfirmation(false), 3000);
      } else {
        console.error("Failed to update rating");
      }
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const renderStars = (selectedRating, isDisabled) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= selectedRating ? "filled" : ""} ${
              isDisabled ? "disabled" : ""
            }`}
            onClick={() => !isDisabled && handleRatingClick(star)}
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  if (isGuest) {
    return (
      <div className="product-actions">
        <p className="sign-in-message">Sign in to buy and sell</p>
      </div>
    );
  }

  const isOwner = String(product.user.id) === String(currentUserId);

  return (
    <div className="product-actions">
      {isOwner ? (
        <>
          {product.isAvailable && (
            <motion.button
              className="sell-button"
              onClick={() => handleMarkAsSold(product.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mark as Sold
            </motion.button>
          )}
          <motion.button
            className="delete-button"
            onClick={() => handleDeleteProduct(product.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        </>
      ) : (
        <div className="buyer-actions">
          <motion.button
            className="chat-button"
            onClick={() =>
              handleChatClick(product.user.id, product.user.fullName)
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Message {product.user.fullName}
          </motion.button>
          <div className="rating-container">
            <div
              className={`star-rating ${hasRated ? "disabled" : ""}`}
              onMouseLeave={handleRatingLeave}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    star <= (hoverRating || rating) ? "filled" : ""
                  } ${hasRated ? "disabled" : ""}`}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                >
                  &#9733;
                </span>
              ))}
            </div>
            {hasRated ? (
              <div className="rating-message">
                <span className="rating-tick">&#10004;</span>
                Rated
              </div>
            ) : (
              <motion.button
                className="submit-rating"
                onClick={submitRating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={rating === 0}
              >
                Rate
              </motion.button>
            )}
          </div>
        </div>
      )}
      {showRatingConfirmation && (
        <motion.div
          className="rating-confirmation"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          Thank you for rating this seller!
        </motion.div>
      )}
    </div>
  );
}

export default ProductActions;
