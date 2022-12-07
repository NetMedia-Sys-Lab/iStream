import axios from "axios";

export const DOMAIN = "http://localhost:7070/";

export var API = axios.create({
   baseURL: DOMAIN,
});


