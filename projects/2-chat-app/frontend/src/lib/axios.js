import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  // automatically send cookies with requests
  withCredentials: true,
});
