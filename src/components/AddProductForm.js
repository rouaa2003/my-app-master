import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { fetchWithAuth } from "../api/fetchWithAuth";
import { getCategories, getCountries } from "../api/apiService";
import "./AddProductForm.css";

function AddProductForm({ onClose, onSuccess }) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const selectedCountry = watch("countryId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, countriesData] = await Promise.all([
          getCategories(),
          getCountries(),
        ]);
        setCategories(
          categoriesData.map((c) => ({ value: c.id.toString(), label: c.name }))
        );
        setCountries(countriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find((c) => c.id === parseInt(selectedCountry));
      setCities(
        country
          ? country.cities.map((city) => ({ value: city.id, label: city.name }))
          : []
      );
    } else {
      setCities([]);
    }
  }, [selectedCountry, countries]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "files") {
        for (let i = 0; i < data.files.length; i++) {
          formData.append("FilesToAdd", data.files[i]);
        }
      } else if (key === "categories") {
        data.categories.forEach((category) => {
          formData.append("CategoriesToAdd", category.value.toString());
        });
      } else if (key !== "countryId") {
        formData.append(key, data[key]);
      }
    });

    formData.append("IsAvailable", data.status === "available");
    formData.append("Status", data.status === "available" ? 1 : 0);

    try {
      const response = await fetchWithAuth(
        "http://www.product.somee.com/api/Product/AddProduct",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("Full response:", response);

      if (response.ok) {
        const responseText = await response.text();
        console.log("Response text:", responseText);

        if (responseText) {
          try {
            const result = JSON.parse(responseText);
            console.log("Parsed JSON result:", result);
          } catch (parseError) {
            console.log("Response is not JSON, but request was successful");
          }
        } else {
          console.log("Response is empty, but request was successful");
        }

        setSuccess("Product added successfully!");
        setError(null);

        // Call onSuccess prop or onClose
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage =
          errorResponse.errorMessage || "An unknown error occurred";
        throw new Error(errorMessage);
      }
    } catch (error) {
      setError(`Error adding product: ${error.message}`);
      setSuccess(null);
      onClose();
      console.error("Error adding product:", error);
    }
  };

  const validateFiles = (files) => {
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.includes("png")) {
          return "Only PNG files are allowed";
        }
      }
    }
    return true;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Add New Product</h2>
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <>
                  <label htmlFor="title">Product Name</label>
                  <input
                    {...field}
                    id="title"
                    placeholder="Enter product name"
                  />
                  {errors.title && (
                    <span className="error">{errors.title.message}</span>
                  )}
                </>
              )}
            />
          </div>

          <div className="form-group">
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <>
                  <label htmlFor="description">Description</label>
                  <textarea
                    {...field}
                    id="description"
                    placeholder="Enter product description"
                  />
                  {errors.description && (
                    <span className="error">{errors.description.message}</span>
                  )}
                </>
              )}
            />
          </div>

          <div className="form-group">
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <>
                  <label htmlFor="address">Address</label>
                  <textarea
                    {...field}
                    id="address"
                    placeholder="Enter product address"
                  />
                  {errors.address && (
                    <span className="error">{errors.address.message}</span>
                  )}
                </>
              )}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <Controller
                name="price"
                control={control}
                defaultValue=""
                rules={{ required: "Price is required", min: 0 }}
                render={({ field }) => (
                  <>
                    <label htmlFor="price">Price</label>
                    <input
                      {...field}
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <span className="error">{errors.price.message}</span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="form-group">
              <Controller
                name="quantity"
                control={control}
                defaultValue=""
                rules={{ required: "Quantity is required", min: 0 }}
                render={({ field }) => (
                  <>
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      {...field}
                      id="quantity"
                      type="number"
                      placeholder="0"
                    />
                    {errors.quantity && (
                      <span className="error">{errors.quantity.message}</span>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <Controller
                name="status"
                control={control}
                defaultValue="1"
                render={({ field }) => (
                  <>
                    <label htmlFor="status">Status</label>
                    <select {...field} id="status">
                      <option value="1">Available</option>
                      <option value="0">Sold</option>
                    </select>
                  </>
                )}
              />
            </div>
            <div className="form-group">
              <Controller
                name="countryId"
                control={control}
                defaultValue=""
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <>
                    <label htmlFor="countryId">Country</label>
                    <select {...field} id="countryId">
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.countryId && (
                      <span className="error">{errors.countryId.message}</span>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="form-group">
            <Controller
              name="cityId"
              control={control}
              defaultValue=""
              rules={{ required: "City is required" }}
              render={({ field }) => (
                <>
                  <label htmlFor="cityId">City</label>
                  <select {...field} id="cityId" disabled={!selectedCountry}>
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                  {errors.cityId && (
                    <span className="error">{errors.cityId.message}</span>
                  )}
                </>
              )}
            />
          </div>

          <div className="form-group">
            <Controller
              name="categories"
              control={control}
              defaultValue={[]}
              rules={{ required: "At least one category is required" }}
              render={({ field }) => (
                <>
                  <label>Categories</label>
                  <Select
                    {...field}
                    options={categories}
                    isMulti
                    placeholder="Select categories"
                  />
                  {errors.categories && (
                    <span className="error">{errors.categories.message}</span>
                  )}
                </>
              )}
            />
          </div>

          <div className="form-group">
            <Controller
              name="files"
              control={control}
              defaultValue=""
              rules={{
                required: "At least one image is required",
                validate: validateFiles,
              }}
              render={({ field: { onChange, onBlur, name } }) => (
                <>
                  <label htmlFor="files">Images (PNG only)</label>
                  <input
                    type="file"
                    id="files"
                    multiple
                    accept=".png"
                    onChange={(e) => onChange(e.target.files)}
                    onBlur={onBlur}
                    name={name}
                  />
                  {errors.files && (
                    <span className="error">{errors.files.message}</span>
                  )}
                </>
              )}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Add Product
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;
