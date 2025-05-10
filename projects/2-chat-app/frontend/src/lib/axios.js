import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  // automatically send cookies with requests
  withCredentials: true,
});
