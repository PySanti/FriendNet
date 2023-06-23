import axios from 'axios'
import BACKEND_URL from "../main.jsx"
export const getAllUsers = () => {
    return axios.get(BACKEND_URL + "api/usuarios")
}