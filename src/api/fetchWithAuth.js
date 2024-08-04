export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("authToken"); // Or another method to retrieve the auth token
  const headers = {
    ...options.headers,
    Authorization: token,
    "Content-Type": "application/json", // Set content type for POST/PUT requests
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Assuming the response is JSON; adjust if needed
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
