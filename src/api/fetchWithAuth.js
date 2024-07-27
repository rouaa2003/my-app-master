export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("authToken"); // Or another method to retrieve the auth token
  const headers = {
    ...options.headers,
    Authorization: token,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
