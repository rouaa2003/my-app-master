import React, { useState } from "react";
import { fetchWithAuth } from "../api/fetchWithAuth"; // Adjust the import path as needed
import "./ProductForm.css";

function AddProductForm({ onClose }) {
  // State to store user input
  const [productName, setProductName] = useState("");
  const [productCondition, setProductCondition] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productStatus, setProductStatus] = useState("available");
  const [productCity, setProductCity] = useState("Damascus");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the data to be sent with user input
    const productData = {
      title: productName,
      description: productCondition,
      address: productImage,
      price: 0, // Default or calculated value
      quantity: 0, // Default or calculated value
      isAvailable: productStatus === "available",
      cityId: getCityId(productCity), // Function to map city name to ID
      status: productStatus === "available" ? 1 : 0,
      filesToAdd: [productImage],
      filesToRemove: [],
      categoriesToAdd: [], // Assuming no categories in this form
    };

    try {
      const response = await fetchWithAuth(
        "http://www.product.somee.com/api/Product/AddProduct",
        {
          method: "POST",
          body: JSON.stringify(productData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Product added successfully!");
      setError(null);
      console.log("Product added successfully:", response);

      // Optionally handle success (e.g., show a success message)
      onClose();
    } catch (error) {
      setError(`Error adding product: ${error.message}`);
      setSuccess(null);
      console.error("Error adding product:", error);

      // Optionally handle error (e.g., show an error message)
    }
  };

  // Function to map city name to ID (dummy implementation)
  const getCityId = (cityName) => {
    const cityMap = {
      Damascus: 1,
      Aleppo: 2,
      Homs: 3,
      Latakia: 4,
      Tartus: 5,
    };
    return cityMap[cityName] || 0; // Default to 0 if city not found
  };

  return (
    <div className="add-product-form-container">
      <form id="add-product-form" onSubmit={handleSubmit}>
        <h2>Add New Product</h2>
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
        <label htmlFor="product-name">Product Name:</label>
        <input
          type="text"
          id="product-name"
          name="product-name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <label htmlFor="product-condition">Condition:</label>
        <input
          type="text"
          id="product-condition"
          name="product-condition"
          value={productCondition}
          onChange={(e) => setProductCondition(e.target.value)}
          required
        />
        <label htmlFor="product-image">Image URL:</label>
        <input
          type="text"
          id="product-image"
          name="product-image"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
          required
        />
        <label htmlFor="product-status">Status:</label>
        <select
          id="product-status"
          name="product-status"
          value={productStatus}
          onChange={(e) => setProductStatus(e.target.value)}
          required
        >
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
        <label htmlFor="product-city">City:</label>
        <select
          id="product-city"
          name="product-city"
          value={productCity}
          onChange={(e) => setProductCity(e.target.value)}
          required
        >
          <option value="Damascus">Damascus</option>
          <option value="Aleppo">Aleppo</option>
          <option value="Homs">Homs</option>
          <option value="Latakia">Latakia</option>
          <option value="Tartus">Tartus</option>
        </select>
        <button type="submit">Add Product</button>
        <button type="button" id="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;
