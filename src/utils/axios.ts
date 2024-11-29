import axios, { AxiosRequestConfig } from 'axios';

const axiosServices = axios.create({
  baseURL: process.env.NEXT_APP_API_URL || 'http://localhost:1337/' // Make sure the base URL is correct
});

axiosServices.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/')) {
      window.location.pathname = '/';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

// POST request handler
export const fetcherPost = async (url: string, data: any, config: AxiosRequestConfig = {}) => {
  try {
    const response = await axiosServices.post(url, data, config);
    return response.data; // Return only the data from the response
  } catch (error: any) {
    // Handling errors, for now, just logging the error
    console.error('Error with fetcherPost:', error);
    throw error; // Re-throw error so it can be handled in the component
  }
};

// GET request handler (you already have a version)
export const fetcher = async (
  url: string,
  p0: { identifier: string | undefined; password: string | undefined },
  config: AxiosRequestConfig = {}
) => {
  try {
    const response = await axiosServices.get(url, config);
    return response.data; // Return only the data from the response
  } catch (error: any) {
    console.error('Error with fetcher:', error);
    throw error; // Re-throw error so it can be handled in the component
  }
};
