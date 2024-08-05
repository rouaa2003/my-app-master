import React, { useState, useEffect, useCallback } from "react";
import {
  getCategories,
  getCountries,
  getProducts,
  deleteProduct,
} from "../api/apiService";
import { Atom } from "react-loading-indicators";
import { Filter } from "lucide-react";
import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import "./ProductGrid.css";

function ProductGrid({ currentUserId }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [activeChatSellerId, setActiveChatSellerId] = useState(null);
  const [activeChatSellerName, setActiveChatSellerName] = useState(null);

  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [imageIndices, setImageIndices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  const handleChatClick = (sellerId, sellerFullName) => {
    setActiveChatSellerId(sellerId);
    setActiveChatSellerName(sellerFullName);
  };

  const handleCloseChat = () => {
    setActiveChatSellerId(null);
    setActiveChatSellerName(null);
  };

  const toggleChatList = () => {
    setIsChatListOpen(!isChatListOpen);
    setActiveChatSellerId(null);
    setActiveChatSellerName(null);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
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

    fetchInitialData();
  }, []);

  const fetchProductsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = {
        categoryId: selectedCategory || undefined,
        cityId: selectedCity || undefined,
        countryId: selectedCountry || undefined,
        textSearch: searchText || undefined,
        status: status || undefined,
        myProducts: false,
      };

      Object.keys(filters).forEach(
        (key) => filters[key] === undefined && delete filters[key]
      );

      const productsData = await getProducts(filters);

      const updatedProducts = productsData.map((product) => ({
        ...product,
        user: {
          ...product.user,
          id: String(product.user.id),
        },
      }));

      setProducts(updatedProducts);

      const initialIndices = productsData.reduce((acc, product) => {
        acc[product.id] = 0;
        return acc;
      }, {});
      setImageIndices(initialIndices);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedCity, selectedCountry, searchText, status]);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  useEffect(() => {
    // Perform actions when currentUserId changes
    // For example, re-fetch products if needed
  }, [currentUserId]);

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
    setSelectedCity("");
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const getImageUrl = (fileUrl) => {
    if (!fileUrl) return null;
    const encodedUrl = encodeURIComponent(fileUrl);
    return `http://www.product.somee.com/api/Product/GetFile?url=${encodedUrl}`;
  };

  const handlePreviousImage = (productId) => {
    setImageIndices((prevIndices) => ({
      ...prevIndices,
      [productId]:
        (prevIndices[productId] -
          1 +
          products.find((p) => p.id === productId).files.length) %
        products.find((p) => p.id === productId).files.length,
    }));
  };

  const handleNextImage = (productId) => {
    setImageIndices((prevIndices) => ({
      ...prevIndices,
      [productId]:
        (prevIndices[productId] + 1) %
        products.find((p) => p.id === productId).files.length,
    }));
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const getRatingInfo = (rating) => {
    if (rating >= 90) return { class: "rating-excellent", phrase: "Excellent" };
    if (rating >= 70) return { class: "rating-good", phrase: "Good" };
    if (rating >= 50) return { class: "rating-fair", phrase: "Fair" };
    if (rating >= 30) return { class: "rating-poor", phrase: "Poor" };
    return { class: "rating-very-poor", phrase: "Very Poor" };
  };

  if (isLoading) {
    return (
      <div className="loading-indicator">
        <Atom
          color="#314acc"
          size="large"
          text="loading products"
          textColor=""
        />
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <button
        className={`filter-toggle ${isFiltersVisible ? "active" : ""}`}
        onClick={toggleFilters}
      >
        <Filter size={18} />
        {isFiltersVisible ? "Hide Filters" : "Show Filters"}
      </button>
      <div
        className={`product-grid ${isChatListOpen ? "shrink" : ""} ${
          isFiltersVisible ? "filters-visible" : ""
        }`}
      >
        <div className={`filters ${isFiltersVisible ? "visible" : ""}`}>
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
            <label htmlFor="status-select">Status</label>
            <select
              id="status-select"
              value={status}
              onChange={handleStatusChange}
            >
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
        </div>

        <div className="product-cards">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  {product.files && product.files.length > 0 ? (
                    <>
                      <img
                        src={getImageUrl(
                          product.files[imageIndices[product.id]].url
                        )}
                        alt={product.title}
                        onError={(error) => {
                          console.log("error", error);
                        }}
                      />
                      {product.files.length > 1 && (
                        <>
                          <button
                            className="image-nav-button prev-button"
                            onClick={() => handlePreviousImage(product.id)}
                          >
                            &#8249;
                          </button>
                          <button
                            className="image-nav-button next-button"
                            onClick={() => handleNextImage(product.id)}
                          >
                            &#8250;
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="product-details">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">${product.price}</p>
                  <p className="product-location">
                    {product.city.name}, {product.city.country.name}
                  </p>
                  <p className="product-description">{product.description}</p>
                  <p className="product-status">
                    {product.isAvailable
                      ? `${product.quantity} Available`
                      : "Sold"}
                  </p>
                  <p
                    className={`seller-rating ${
                      getRatingInfo(product.user.rating).class
                    }`}
                  >
                    Seller Rating: {getRatingInfo(product.user.rating).phrase}
                  </p>
                </div>
                <div className="product-actions">
                  {String(product.user.id) === String(currentUserId) ? (
                    <>
                      {product.isAvailable && (
                        <button className="sell-button">Mark as Sold</button>
                      )}
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      className="chat-button"
                      onClick={() =>
                        handleChatClick(product.user.id, product.user.fullName)
                      }
                    >
                      Message {product.user.fullName}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>

      <button className="chat-list-toggle" onClick={toggleChatList}>
        {isChatListOpen ? "Close Chat List" : "Open Chat List"}
      </button>

      <div className={`chat-list-container ${isChatListOpen ? "open" : ""}`}>
        {isChatListOpen && <ChatList onSelectChat={handleChatClick} />}
      </div>

      {activeChatSellerId && (
        <ChatWindow
          sellerId={activeChatSellerId}
          onClose={handleCloseChat}
          sellerName={activeChatSellerName}
        />
      )}
    </div>
  );
}

export default ProductGrid;
