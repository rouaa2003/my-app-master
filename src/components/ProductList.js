import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import "./ProductList.css";

function ProductList({
  products,
  currentUserId,
  isGuest,
  handleChatClick,
  handleDeleteProduct,
  imageIndices,
  handlePreviousImage,
  handleNextImage,
  handleMarkAsSold,
  handleMarkAsAvailable,
}) {
  return (
    <AnimatePresence>
      <motion.div className="product-cards" layout>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card-wrapper">
              <ProductCard
                product={product}
                currentUserId={currentUserId}
                isGuest={isGuest}
                handleChatClick={handleChatClick}
                handleDeleteProduct={handleDeleteProduct}
                imageIndex={imageIndices[product.id]}
                handlePreviousImage={handlePreviousImage}
                handleNextImage={handleNextImage}
                handleMarkAsSold={handleMarkAsSold}
                handleMarkAsAvailable={handleMarkAsAvailable}
              />
            </div>
          ))
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No products available
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default ProductList;
