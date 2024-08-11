// ProductActions.js
import React from "react";
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
      )}
    </div>
  );
}

export default ProductActions;
