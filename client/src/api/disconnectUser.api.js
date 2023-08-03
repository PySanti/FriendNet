import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'
import { config } from './baseConfig.api'
/**
 * Llama a la api para desconectar al usuario con user_id
 * @param {String} user_id
 */
export async function disconnectUserAPI(user_id, accessToken){
    const data = {
        'session_user_id':user_id
    }
    config.headers = {
        "Authentication" : `Bearer ${accessToken}`
    }
    return await axios.post(BACKEND_URL+"api/disconnect_user/",data, config)
}

