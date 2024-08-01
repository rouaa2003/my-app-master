import React, { useState, useEffect } from "react";
import {
  getCategories,
  getCountries,
  getProducts,
  deleteProduct,
} from "../api/apiService"; // Adjust the import path as needed
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
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [imageIndices, setImageIndices] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleChatClick = (sellerId) => {
    setActiveChatSellerId(sellerId);
  };

  const handleCloseChat = () => {
    setActiveChatSellerId(null);
  };

  const toggleChatList = () => {
    setIsChatListOpen(!isChatListOpen);
    setActiveChatSellerId(null);
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

  useEffect(() => {
    const fetchProductsData = async () => {
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

        // Convert user IDs to strings for consistent comparison
        const updatedProducts = productsData.map((product) => ({
          ...product,
          user: {
            ...product.user,
            id: String(product.user.id),
          },
        }));

        setProducts(updatedProducts);

        // Initialize image indices for products
        const initialIndices = productsData.reduce((acc, product) => {
          acc[product.id] = 0;
          return acc;
        }, {});
        setImageIndices(initialIndices);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    };

    fetchProductsData();
  }, [selectedCategory, selectedCity, selectedCountry, searchText, status]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-grid-container">
      <div className={`product-grid ${isChatListOpen ? "shrink" : ""}`}>
        <div className="filters">
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
              <option value="">All Statuses</option>
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "path/to/placeholder-image.jpg";
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
                  <p className="product-description">
                    {product.description}
                  </p>
                  <p className="product-status">
                    {product.isAvailable ? "Available" : "Sold"}
                  </p>
                </div>
                <div className="product-actions">
                  <button
                    className="chat-button"
                    onClick={() => handleChatClick(product.user.id)}
                  >
                    Message Seller
                  </button>
                  {String(product.user.id) === currentUserId && (
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
        <ChatWindow sellerId={activeChatSellerId} onClose={handleCloseChat} />
      )}
    </div>
  );
}

export default ProductGrid;
