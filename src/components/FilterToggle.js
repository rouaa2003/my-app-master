// FilterToggle.js
import React from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import "./FilterToggle.css";

function FilterToggle({ isFiltersVisible, toggleFilters }) {
  return (
    <motion.button
      className={`filter-toggle ${isFiltersVisible ? "active" : ""}`}
      onClick={toggleFilters}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isFiltersVisible ? <X size={18} /> : <Filter size={18} />}
      {isFiltersVisible ? "Hide Filters" : "Show Filters"}
    </motion.button>
  );
}

export default FilterToggle;
