import React, { useState, useEffect } from "react";
import { getCategories, getCountries, getProducts } from "../api/apiService"; // Adjust the import path as needed
import "./ProductGrid.css";

const dummyProducts = [
  {
    name: "Product 1",
    condition: "New",
    status: "Available",
    city: "Damascus",
    categories: ["Clothes", "Electronics"],
    seller: "John Doe",
    image: "https://via.placeholder.com/250",
  },
  {
    name: "Product 2",
    condition: "Used",
    status: "Sold",
    city: "Aleppo",
    categories: ["Furniture", "Appliances"],
    seller: "Jane Doe",
    image: "https://via.placeholder.com/250",
  },
];

function ProductGrid({ isChatOpen }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, countriesData] = await Promise.all([
          getCategories(),
          getCountries(),
        ]);
        setCategories(categoriesData);
        setCountries(countriesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []);

  // TODO UNCOMMENT WHEN BACKEND HAS PRODUCT DATA

  // useEffect(() => {
  //   const fetchProductsData = async () => {
  //     try {
  //       const filters = {
  //         categoryId:
  //           selectedCategory === "All"
  //             ? ""
  //             : categories.find((cat) => cat.name === selectedCategory)?.id,
  //         cityId:
  //           selectedCity === ""
  //             ? ""
  //             : cities.find((city) => city.name === selectedCity)?.id,
  //         countryId: selectedCountry,
  //         textSearch: searchText,
  //         status: 1, // Assuming you want to fetch available products
  //         myProducts: false, // Adjust based on requirements
  //       };
  //       const productsData = await getProducts(filters);
  //       setProducts(productsData);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };

  //   fetchProductsData();
  // }, [
  //   selectedCategory,
  //   selectedCity,
  //   selectedCountry,
  //   searchText,
  //   categories,
  //   cities,
  // ]);

  // TODO remove dummydata when having live data
  // Setting dummy products for now
  useEffect(() => {
    setProducts(dummyProducts);
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCountryChange = (event) => {
    const countryId = event.target.value;
    setSelectedCountry(countryId);

    const selectedCountryData = countries.find(
      (country) => country.id === parseInt(countryId)
    );
    setCities(selectedCountryData ? selectedCountryData.cities : []);
    setSelectedCity(""); // Reset city selection when country changes
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div
      className="product-grid"
      id="product-grid"
      style={{ width: isChatOpen ? "65%" : "100%" }}
    >
      <div className="filters">
        <div className="filter">
          <label htmlFor="category-select">Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label htmlFor="country-select">Country:</label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="">Select a Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label htmlFor="city-select">City:</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedCountry}
          >
            <option value="">Select a City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label htmlFor="search-input">Search:</label>
          <input
            id="search-input"
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search products..."
          />
        </div>
      </div>

      <div className="product-cards">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              className="product-card"
              key={index}
              data-seller={product.seller}
            >
              <img src={product.image} alt={product.name} />
              <div className="product-details">
                <h3>{product.name}</h3>
                <p>Condition: {product.condition}</p>
                <p>Status: {product.status}</p>
                <p>City: {product.city}</p>
                <p>Categories: {product.categories.join(", ")}</p>
                <button className="chat-button">Chat with Seller</button>
                <button className="sell-button">Mark as Sold</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
}

export default ProductGrid;
