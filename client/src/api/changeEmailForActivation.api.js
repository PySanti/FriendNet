import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { config } from "./baseConfig.api";


/**
 * Llama a la api para cambiar email del usuario
 * @param {Number} user_id
 * @param {String} user_email
 */
export async function changeEmailForActivationAPI(user_id, user_email){
    const data = {
        'user_id' : user_id,
        'new_email' : user_email
    }
    return await axios.post(BACKEND_URL + 'api/change_email_for_activation/', data, config)
}



