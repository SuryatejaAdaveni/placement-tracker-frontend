import axios from "axios";

let axiosInstance = axios.create({
  baseURL: "http://localhost:5173/",
});

export default axiosInstance;
