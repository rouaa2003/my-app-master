// ProductDetails.js
import React from "react";
import { motion } from "framer-motion";
import { renderStars } from "../utils/renderStars";
import "./ProductDetails.css";

function ProductDetails({ product }) {
  return (
    <motion.div
      className="product-details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">${product.price}</p>
      <p className="product-location">
        {product.city.name}, {product.city.country.name}
      </p>
      <p className="product-description">{product.description}</p>
      <p className="product-status">
        {product.isAvailable ? `${product.quantity} Available` : "Sold"}
      </p>
      <div className="seller-info">
        <span>Seller: {product.user.fullName}</span>
        <span className="seller-rating">
          {renderStars(product.user.rating)}
        </span>
      </div>
    </motion.div>
  );
}

export default ProductDetails;
