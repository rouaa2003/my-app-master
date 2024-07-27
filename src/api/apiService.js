import { fetchWithAuth } from "./fetchWithAuth"; // Adjust the import path as needed

export const getCategories = async () => {
  try {
    const result = await fetchWithAuth(
      "http://www.product.somee.com/api/Product/GetAllCategory"
    );
    if (result.data) {
      return result.data;
    }
    throw new Error("No data found in API response");
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
    if (Array.isArray(result)) {
      return result;
    }
    throw new Error("No data found in API response");
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const getProducts = async (filters) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const result = await fetchWithAuth(
      `http://www.product.somee.com/api/Product/GetAllProducts?${query}`
    );
    if (result.data) {
      return result.data;
    }
    throw new Error("No data found in API response");
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
