import axios from 'axios'

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wheelock-backend.onrender.com' 
  : 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL
})

export default api