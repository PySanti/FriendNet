import axios from 'axios'
import { BACKEND_URL } from '../main'
import { config } from './baseConfig.api'
/**
 * Llama a la api para desconectar al usuario con user_id
 * @param {String} user_id
 */
export async function disconnectUserAPI(user_id){
    const data = {
        'session_user_id':user_id
    }
    return await axios.post(BACKEND_URL+"api/disconnect_user/",data, config)
}

