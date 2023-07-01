import axios from "axios";
import { BACKEND_URL } from "../main";
import { config } from "./baseConfig.api";

/**
 * Llama a la api para logear usuario al server
 * @param {String} username  
 * @param {String} password  
 * @returns {Promise} la promesa del servidor
 */
export async function loginUserAPI(username, password){
    const data = {
        'username' : username,
        'password' : password
    }
    return await axios.post(BACKEND_URL+'api/token/',data, config)
}