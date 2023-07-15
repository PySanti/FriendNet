import axios from 'axios'
import { BACKEND_URL } from '../main'
import { config } from './baseConfig.api'
/**
 * Llama a api que retorna lista de usuarios de la pagina
 * @param {Number} sessionUserId Id de usuario de sesion activa
 */
export async function getUsersListAPI(sessionUserId){
    const data = {
        'session_user_id' : sessionUserId
    }
    return await axios.post(BACKEND_URL + `api/get_user_list/`, data, config)
}

