import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { config } from "./baseConfig.api";


/**
 * Llama a la api para cambiar email del usuario
 * @param {Number} userId
 * @param {String} userEmail
 * @param {String} password
 */
export async function changeEmailForActivationAPI(userId, userEmail, password){
    const data = {
        'user_id' : userId,
        'new_email' : userEmail,
        'password' : password
    }
    return await axios.post(BACKEND_URL + 'api/change_email_for_activation/', data, config)
}



