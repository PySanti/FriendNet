import axios from "axios";
import { BACKEND_URL } from "../main";
import { config } from "./baseConfig.api";

/**
 * Llama a la api para obtener datos de usuario con username
 * @param {String} username  
 * @returns {Promise} la promesa del servidor
 */
export async function getUserDetailAPI(username){
    const data = {
        'username' : username
    }
    return await axios.post(BACKEND_URL + 'api/get_user_detail/', data, config)
}