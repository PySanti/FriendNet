import axios from 'axios'
import { BACKEND_URL } from '../main'
import { config } from './baseConfig.api'


/**
 * Llama a la api para comprobar existencia de usuario por username y email
 * @param {String} username  
 * @param {String} email
 * @returns {Promise} la promesa del servidor
 */
export async function checkExistingUserAPI(username, email){
    const data =     {
        'username': username,
        'email' : email
    }
    return await axios.post(BACKEND_URL + `api/create/check_existing_user/`,data, config)
}