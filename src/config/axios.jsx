import axios from 'axios'

const clienteAxios = axios.create({
    // baseURL:`http://localhost:4000/api`
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
})



export  default clienteAxios