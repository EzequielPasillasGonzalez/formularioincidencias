import axios from "axios";

const awsApi = axios.create({
    baseURL: 'https://m2xz0fo5gl.execute-api.us-east-1.amazonaws.com/desarrollo'    
})

export default awsApi