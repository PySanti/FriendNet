import { config } from './baseConfig.api'
import axios from 'axios'
import { BACKEND_URL } from '../main'


/**
 * Carga datos del archivo smtpjs.json y envia correo con activation_code al usuario username 
 * @param {String} user_email  
 * @param {String} username  
 * @param {String} activation_code  
 * @returns {Promise} la promesa del servidor
 */
export async function sendActivationEmailAPI(user_email, username, activation_code){
    const data = {
        'username' : username,
        'user_email' : user_email,
        'activation_code' : activation_code,
    }
    return await axios.post(BACKEND_URL + `api/send_activation_email/`,data, config)
}



