import axios from "axios";

const axiosClient = axios.create({
	baseURL: "http://172.16.24.224:8080",
});

export default axiosClient;
