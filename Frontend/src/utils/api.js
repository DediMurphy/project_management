import axios from "axios";
import {setupInterceptors} from "./interceptors.js";

const API_URL = import.meta.env.VITE_API_URL 

const API = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

setupInterceptors(API);

export default API;