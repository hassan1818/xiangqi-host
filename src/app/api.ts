// ensures all requests use a single configured client with credentials enabled (for cookies).

import axios from "axios";

const API = axios.create({
  baseURL: "https://xiangchi-api.onrender.com/api/v1",
  withCredentials: true, // very important for cookies this ensures cookies (JWT) are sent
});

export default API;
