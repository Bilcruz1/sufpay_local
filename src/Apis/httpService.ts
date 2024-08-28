import axios from "axios";
import { IResponse } from "../utils/interfaces";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Signature": `something random`,
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedError) {
      alert("An unexpected error occurred from response.");
    }
    return Promise.reject(error);
  }
);

export default {
  get: API.get,
  post: API.post,
  put: API.put,
  delete: API.delete,
};

export const handleApiError = (
  error: any
): any => {
  const errorMessage =
    error.response?.data?.message || "An unexpected error occurred.";
  return { error: [errorMessage], data: null };
};
