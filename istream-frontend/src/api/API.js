import axios from "axios";

var API = axios.create({
	baseURL: "http://localhost:8888/"
});

export default API;