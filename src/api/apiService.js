import { fetchWithAuth } from "./fetchWithAuth"; // Adjust the import path as needed

export const getCategories = async () => {
  try {
    const result = await fetchWithAuth(
      "http://www.product.somee.com/api/Product/GetAllCategory"
    );

    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    throw new Error("No valid data found in categories API response");
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCountries = async () => {
  try {
    const result = await fetchWithAuth(
      "http://www.product.somee.com/api/Location/GetAllCountry"
    );

    if (result && Array.isArray(result)) {
      return result;
    } else if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    throw new Error("No valid data found in countries API response");
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const getProducts = async (filters) => {
  try {
    const query = new URLSearchParams();

    // Only add parameters if they have a value
    if (filters.categoryId) query.append("categoryId", filters.categoryId);
    if (filters.cityId) query.append("cityId", filters.cityId);
    if (filters.countryId) query.append("countryId", filters.countryId);
    if (filters.textSearch) query.append("textSearch", filters.textSearch);
    if (filters.status !== undefined) query.append("status", filters.status);
    if (filters.myProducts !== undefined)
      query.append("myProducts", filters.myProducts);

    const queryString = query.toString();
    const url = `http://www.product.somee.com/api/Product/GetAllProducts${
      queryString ? `?${queryString}` : ""
    }`;

    const result = await fetchWithAuth(url);
    if (result.data) {
      return result.data;
    }
    throw new Error("No data found in API response");
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// apiService.js or appropriate service file
export const deleteProduct = async (productId) => {
  const url = `http://www.product.somee.com/api/Product/RemoveProduct?id=${productId}`;
  try {
    const response = await fetchWithAuth(url, {
      method: "DELETE",
    });

    if (response.ok) {
      // Check if the response body is not empty before parsing
      if (response.headers.get("content-length") > 0) {
        await response.json(); // This line assumes the response contains JSON
      }
      return true;
    }
    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.errorMessage || "An unknown error occurred";
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error deleting product:", error.errorMessage);
    return false;
  }
};
