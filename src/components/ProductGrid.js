import React, { useState, useEffect, useCallback } from "react";
import {
  getCategories,
  getCountries,
  getProducts,
  deleteProduct,
} from "../api/apiService";
import { Atom } from "react-loading-indicators";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import { renderStars } from "../utils/renderStars";
import { motion, AnimatePresence } from "framer-motion";
import "./ProductGrid.css";

function ProductGrid({
  currentUserId,
  isGuest,
  isAuthenticated,
  authStateChange,
  onLoginSuccess,
}) {
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
  const [hoveredProduct, setHoveredProduct] = useState(null);

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
  const productVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="product-grid-container"
    >
      <motion.button
        className={`filter-toggle ${isFiltersVisible ? "active" : ""}`}
        onClick={toggleFilters}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isFiltersVisible ? <X size={18} /> : <Filter size={18} />}
        {isFiltersVisible ? "Hide Filters" : "Show Filters"}
      </motion.button>
      <div
        className={`product-grid ${isChatListOpen ? "shrink" : ""} ${
          isFiltersVisible ? "filters-visible" : ""
        }`}
      >
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
        </motion.div>

        <AnimatePresence>
          <motion.div className="product-cards" layout>
            {products.length > 0 ? (
              products.map((product) => (
                <motion.div
                  className="product-card"
                  key={product.id}
                  variants={productVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  onHoverStart={() => setHoveredProduct(product.id)}
                  onHoverEnd={() => setHoveredProduct(null)}
                >
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
                            <motion.button
                              className="image-nav-button prev-button"
                              onClick={() => handlePreviousImage(product.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ChevronLeft size={24} />
                            </motion.button>
                            <motion.button
                              className="image-nav-button next-button"
                              onClick={() => handleNextImage(product.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ChevronRight size={24} />
                            </motion.button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                  </div>
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
                      {product.isAvailable
                        ? `${product.quantity} Available`
                        : "Sold"}
                    </p>
                    <span className="seller-info">
                      Seller: {product.user.fullName}{" "}
                      {renderStars(product.user.rating)}
                    </span>
                  </motion.div>
                  <motion.div
                    className="product-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {isGuest ? (
                      <p className="sign-in-message">Sign in to buy and sell</p>
                    ) : (
                      <>
                        {String(product.user.id) === String(currentUserId) ? (
                          <>
                            {product.isAvailable && (
                              <motion.button
                                className="sell-button"
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
                              handleChatClick(
                                product.user.id,
                                product.user.fullName
                              )
                            }
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Message {product.user.fullName}
                          </motion.button>
                        )}
                      </>
                    )}
                  </motion.div>
                </motion.div>
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
      </div>

      <motion.div
        className={`chat-list-container ${isChatListOpen ? "open" : ""}`}
        initial={false}
        animate={isChatListOpen ? { width: "35%" } : { width: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isChatListOpen && <ChatList onSelectChat={handleChatClick} />}
      </motion.div>

      <AnimatePresence>
        {activeChatSellerId && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <ChatWindow
              sellerId={activeChatSellerId}
              onClose={handleCloseChat}
              sellerName={activeChatSellerName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ProductGrid;

/*

      

*/
