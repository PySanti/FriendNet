import { config } from './baseConfig.api'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'


/**
 * Usa utilidad de api para enviar correo con activation_code al usuario username 
 * @param {String} userEmail  
 * @param {String} username  
 * @param {String} activationCode 
 */
export async function sendActivationEmailAPI(userEmail, username, activationCode){
    const data = {
        'username' : username,
        'user_email' : userEmail,
        'activation_code' : activationCode,
    }
    return await axios.post(BACKEND_URL + `api/send_activation_email/`,data, config)
}



