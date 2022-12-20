import axios from "axios";

export const DOMAIN = "http://162.246.156.61:8888/";

export var API = axios.create({
   baseURL: DOMAIN,
});


