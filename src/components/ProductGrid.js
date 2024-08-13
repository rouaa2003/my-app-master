import React, { useState, useEffect, useCallback } from "react";
import {
  getCategories,
  getCountries,
  getProducts,
  deleteProduct,
} from "../api/apiService";
import FilterToggle from "./FilterToggle";
import Filters from "./Filters";
import ProductList from "./ProductList";
import ChatContainer from "./ChatContainer";
import { updateProduct } from "../api/apiService";
import { Atom } from "react-loading-indicators";
import { motion } from "framer-motion";
import "./ProductGrid.css";

function ProductGrid({
  currentUserId,
  isGuest,
  isAuthenticated,
  onProductAdded,
  authStateChange,
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(3);
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
    setIsLoading(true);
    fetchProductsData();
  }, [fetchProductsData, authStateChange]);

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

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value === "" ? undefined : value); // Convert to number or set to undefined
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

  const handleMarkAsSold = async (productId) => {
    try {
      // Find the product to be updated
      const product = products.find((p) => p.id === productId);

      // Prepare the product data for updating
      const productData = {
        Id: productId,
        Title: product.title || "",
        Description: product.description || "",
        Address: product.address || "",
        Price: product.price || "",
        Quantity: product.quantity || "",
        CityId: product.city.id || "",
        Status: 0,
        IsAvailable: false, // Mark as sold
      };
      console.log("productData", productData);
      // Call the API service to update the product
      await updateProduct(productData);

      // Update the local state or UI as needed
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, isAvailable: false, status: 0 } : p
        )
      );

      // Update the local state or UI as needed
      console.log("Product marked as sold successfully.");
    } catch (error) {
      console.error("Error marking product as sold:", error);
    }
  };

  //handleMarkAsAvailable

  const handleMarkAsAvailable = async (productId) => {
    try {
      // Find the product to be updated
      const product = products.find((p) => p.id === productId);

      // Prepare the product data for updating
      const productData = {
        Id: productId,
        Title: product.title || "",
        Description: product.description || "",
        Address: product.address || "",
        Price: product.price || "",
        Quantity: product.quantity || "",
        CityId: product.city.id || "",
        Status: 1,
        IsAvailable: true, // Mark as available
      };
      console.log("productData", productData);
      // Call the API service to update the product
      await updateProduct(productData);

      // Update the local state or UI as needed
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, isAvailable: true, status: 1 } : p
        )
      );

      // Update the local state or UI as needed
      console.log("Product marked as availabe successfully.");
    } catch (error) {
      console.error("Error marking product as availabe:", error);
    }
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
      <FilterToggle
        isFiltersVisible={isFiltersVisible}
        toggleFilters={toggleFilters}
      />
      <div
        className={`product-grid ${isChatListOpen ? "shrink" : ""} ${
          isFiltersVisible ? "filters-visible" : ""
        }`}
      >
        <Filters
          isFiltersVisible={isFiltersVisible}
          categories={categories}
          countries={countries}
          cities={cities}
          selectedCategory={selectedCategory}
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          status={status}
          searchText={searchText}
          handleCategoryChange={handleCategoryChange}
          handleCountryChange={handleCountryChange}
          handleCityChange={handleCityChange}
          handleStatusChange={handleStatusChange}
          handleSearchChange={handleSearchChange}
        />
        <ProductList
          products={products}
          currentUserId={currentUserId}
          isGuest={isGuest}
          handleChatClick={handleChatClick}
          handleDeleteProduct={handleDeleteProduct}
          imageIndices={imageIndices}
          handlePreviousImage={handlePreviousImage}
          handleNextImage={handleNextImage}
          handleMarkAsSold={handleMarkAsSold}
          handleMarkAsAvailable={handleMarkAsAvailable}
        />
      </div>
      <ChatContainer
        isChatListOpen={isChatListOpen}
        activeChatSellerId={activeChatSellerId}
        activeChatSellerName={activeChatSellerName}
        handleChatClick={handleChatClick}
        handleCloseChat={handleCloseChat}
      />
    </motion.div>
  );
}

export default ProductGrid;
