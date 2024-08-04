export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("authToken"); // Or another method to retrieve the auth token
  const headers = {
    ...options.headers,
    Authorization: token,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
