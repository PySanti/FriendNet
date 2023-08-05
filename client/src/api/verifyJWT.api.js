import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { config } from "./baseConfig.api";


/**
 * Llama a la api para verificar JWT
 * @param {String} token
 */
export async function verifyJWTAPI(token){
    const data = {
        token : token
    }
    return await axios.post(BACKEND_URL+"api/token/verify/", data, config)
}



