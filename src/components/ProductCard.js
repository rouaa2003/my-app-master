// ProductCard.js
import React from "react";
import { motion } from "framer-motion";
import ImageCarousel from "./ImageCarousel";
import ProductDetails from "./ProductDetails";
import ProductActions from "./ProductActions";
import "./ProductCard.css";

function ProductCard({
  product,
  currentUserId,
  isGuest,
  handleChatClick,
  handleDeleteProduct,
  imageIndex,
  handlePreviousImage,
  handleNextImage,
  handleMarkAsSold,
  handleMarkAsAvailable,
}) {
  const productVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="product-card"
      variants={productVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <ImageCarousel
        files={product.files}
        imageIndex={imageIndex}
        handlePreviousImage={() => handlePreviousImage(product.id)}
        handleNextImage={() => handleNextImage(product.id)}
      />
      <ProductDetails product={product} />
      <ProductActions
        product={product}
        currentUserId={currentUserId}
        isGuest={isGuest}
        handleChatClick={handleChatClick}
        handleDeleteProduct={handleDeleteProduct}
        handleMarkAsSold={handleMarkAsSold}
        handleMarkAsAvailable={handleMarkAsAvailable}
      />
    </motion.div>
  );
}

export default ProductCard;
