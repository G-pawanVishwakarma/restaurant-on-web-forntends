import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const axiosServices = axios.create({ baseURL: process.env.NEXT_APP_API_URL });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

/**
 * Request interceptor to add Authorization token to request
 */
axiosServices.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.token.accessToken) {
      config.headers['Authorization'] = `Bearer ${session?.token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

export const fetcher = async (
  args: string | [string, AxiosRequestConfig],
  p0: { method: string; headers: { 'Content-Type': string }; body: string }
) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (
  args: string | [string, AxiosRequestConfig],
  p0: { method: string; headers: { 'Content-Type': string }; body: string }
) => {
  // Handle both string and array input for args
  const [url, config] = Array.isArray(args) ? args : [args, {}];

  // Set up the final config with the body and headers
  const finalConfig: AxiosRequestConfig = {
    method: p0.method, // "POST" or other methods
    headers: {
      'Content-Type': 'application/json'
    },
    data: p0.body, // The body to send in the request
    ...config // Spread in any additional config passed in the URL/config array
  };

  try {
    const res = await axios(url, finalConfig);
    return res.data; // Return the data from the response
  } catch (error) {
    // Handle the error (you can customize this part based on your needs)
    console.error('Error in fetcherPost:', error);
    throw error;
  }
};
