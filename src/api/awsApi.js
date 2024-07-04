import axios from "axios";

const awsApi = axios.create({
    baseURL: 'http://localhost:3000/api'    
})

export default awsApi