// Filters.js
import React from "react";
import { motion } from "framer-motion";
import "./Filters.css";

function Filters({
  isFiltersVisible,
  categories,
  countries,
  cities,
  selectedCategory,
  selectedCountry,
  selectedCity,
  status,
  isAvailable,
  searchText,
  handleCategoryChange,
  handleCountryChange,
  handleCityChange,
  handleStatusChange,
  handleSearchChange,
}) {
  console.log("statusdasds", status);
  return (
    <motion.div
      className={`filters ${isFiltersVisible ? "visible" : ""}`}
      initial={false}
      animate={
        isFiltersVisible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }
      }
      transition={{ duration: 0.3 }}
    >
      <div className="filter">
        <label htmlFor="category-select">Category</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="filter">
        <label htmlFor="country-select">Country</label>
        <select
          id="country-select"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div className="filter">
        <label htmlFor="city-select">City</label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedCountry}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
      <div className="filter">
        <label htmlFor="status-select">Availablity</label>
        <select id="status-select" value={status} onChange={handleStatusChange}>
          <option value="true">Available</option>
          <option value="false">Sold</option>
        </select>
      </div>
      <div className="filter">
        <label htmlFor="search-input">Search</label>
        <input
          id="search-input"
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search products..."
        />
      </div>
    </motion.div>
  );
}

export default Filters;
