// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // استبدل هذا بعنوان API الخاص بك

// قم بإنشاء مثيل Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // يمكنك إضافة رؤوس إضافية هنا إذا لزم الأمر
  },
});

// Location API
export const getAllCountries = async () => {
  try {
    const response = await apiClient.get('/api/Location/GetAllCountry');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const seedCountry = async (countryData) => {
  try {
    const response = await apiClient.post('/api/Location/SeedCountry', countryData);
    return response.data;
  } catch (error) {
    console.error('Error seeding country:', error);
    throw error;
  }
};

// Product API
export const seedCategory = async (categoryData) => {
  try {
    const response = await apiClient.post('/api/Product/SeedCategory', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error seeding category:', error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await apiClient.get('/api/Product/GetAllCategory');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await apiClient.post('/api/Product/AddProduct', productData);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productData) => {
  try {
    const response = await apiClient.put('/api/Product/UpdateProduct', productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const removeProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/api/Product/RemoveProduct/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing product:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await apiClient.put('/api/Product/GetAllProducts');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// User API
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/api/User/CreateUser', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await apiClient.post('/api/User/Login', loginData);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiClient.get('/api/User/Logout');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const confirmAccount = async (confirmationData) => {
  try {
    const response = await apiClient.post('/api/User/ConfirmAccount', confirmationData);
    return response.data;
  } catch (error) {
    console.error('Error confirming account:', error);
    throw error;
  }
};

export const resendEmailConfirmCode = async () => {
  try {
    const response = await apiClient.get('/api/User/ResendEmailConfirmCode');
    return response.data;
  } catch (error) {
    console.error('Error resending email confirmation code:', error);
    throw error;
  }
};

export const updateUserProfileInfo = async (userData) => {
  try {
    const response = await apiClient.put('/api/User/UpdateUserProfileInfo', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile info:', error);
    throw error;
  }
};

export const getUserProfileInfo = async () => {
  try {
    const response = await apiClient.get('/api/User/GetUserProfileInfo');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile info:', error);
    throw error;
  }
};

export const changeUserImage = async (imageData) => {
  try {
    const response = await apiClient.post('/api/User/ChangeUserImage', imageData);
    return response.data;
  } catch (error) {
    console.error('Error changing user image:', error);
    throw error;
  }
};

export const removeMyAccount = async () => {
  try {
    const response = await apiClient.delete('/api/User/RemoveMyAccount');
    return response.data;
  } catch (error) {
    console.error('Error removing account:', error);
    throw error;
  }
};

export const updateRating = async (ratingData) => {
  try {
    const response = await apiClient.get('/api/User/UpdateRating', { params: ratingData });
    return response.data;
  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
};

export const receiveBotUpdate = async (updateData) => {
  try {
    const response = await apiClient.post('/api/User/ReceiveBotUpdate', updateData);
    return response.data;
  } catch (error) {
    console.error('Error receiving bot update:', error);
    throw error;
  }
};
