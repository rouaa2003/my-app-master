// ImageCarousel.js
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../utils/imageUtils";
import "./ImageCarousel.css";

function ImageCarousel({
  files,
  imageIndex,
  productId,
  handlePreviousImage,
  handleNextImage,
}) {
  if (!files || files.length === 0) {
    return <div className="placeholder-image">No Image</div>;
  }

  return (
    <div className="product-image">
      <img
        src={getImageUrl(files[imageIndex].url)}
        alt={`Product ${productId}`}
        onError={(error) => {
          console.log("Image loading error", error);
        }}
      />
      {files.length > 1 && (
        <>
          <motion.button
            className="image-nav-button prev-button"
            onClick={() => handlePreviousImage(productId)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            className="image-nav-button next-button"
            onClick={() => handleNextImage(productId)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </>
      )}
    </div>
  );
}

export default ImageCarousel;
