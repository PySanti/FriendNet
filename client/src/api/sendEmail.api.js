import { config } from './baseConfig.api'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'


/**
 * Usa utilidad de api para enviar correo con activation_code al usuario username 
 * @param {String} userEmail  
 * @param {String} activationCode 
 */
export async function sendEmailAPI(userEmail, code, message){
    const data = {
        'user_email' : userEmail,
        'code' : code,
        'message' : message
    }
    return await axios.post(BACKEND_URL + `api/send_email/`,data, config)
}



