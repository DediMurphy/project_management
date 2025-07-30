import axios from "axios";
import {setupInterceptors} from "./interceptors.js";

const API = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

setupInterceptors(API);

export default API;