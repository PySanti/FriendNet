import axios from "axios";
import { BACKEND_URL } from "../main";
import { config } from "./baseConfig.api";


/**
 * Llama a la api para refrescar JWT
 * @param {String} refreshToken token de refresco 
 * @returns {Promise} la promesa del servidor
 */
export async function refreshTokenAPI(refreshToken){
    const data = {
        refresh : refreshToken
    }
    return await axios.post(BACKEND_URL+"api/token/refresh/", data, config)
}