import axios from "axios";

var API = axios.create({
	baseURL: "http://localhost:8080/"
});

export default API;