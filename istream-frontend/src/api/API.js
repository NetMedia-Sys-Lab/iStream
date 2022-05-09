import axios from "axios";

export const DOMAIN = "http://localhost:8888/";

export var API = axios.create({
   baseURL: DOMAIN,
});


