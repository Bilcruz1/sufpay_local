import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Signature": `something random`,
  },
});

API.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    console.log("Logging the error", error);
    alert("An unexpected error occurred.");
  }
  return Promise.reject(error);
});

export default {
  get: API.get,
  post: API.post,
  put: API.put,
  delete: API.delete,
};

export const handleApiError = async (error: any) => {
  try {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred.";
    const data = null;
    return { error: errorMessage, data };
  } catch (err) {
    throw new Error("An unexpected error occurred.");
  }
};
