import axios from "axios";

const awsApi = axios.create({
    baseURL: 'https://s5exxoi6s1.execute-api.us-east-1.amazonaws.com/desarrollo'    
})

export default awsApi