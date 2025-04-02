import axios from 'axios';

const API_URL = 'http://localhost:3001/api';
console.log('Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
});

export const generateImages = async (prompt, n = 1) => {
  try {
    console.log('Generating images with prompt:', prompt, 'count:', n);
    const response = await api.post('/generate', { prompt, n });
    console.log('API response:', response.data);
    
    // Ensure we have images in the response
    if (!response.data || !Array.isArray(response.data.images)) {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format from server');
    }

    return {
      success: true,
      images: response.data.images
    };
  } catch (error) {
    console.error('Error generating images:', error.response?.data || error.message);
    throw error;
  }
};

export const getImages = async () => {
  try {
    const response = await api.get('/images');
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error.response?.data || error.message);
    throw error;
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
