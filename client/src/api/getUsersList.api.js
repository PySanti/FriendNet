import axios from 'axios'
import { BACKEND_URL } from '../main'
import { config } from './baseConfig.api'
/**
 * Llama a api que retorna lista de usuarios de la pagina
 * @param {Number} sessionUserId Id de usuario de sesion activa
 * @param {Number} userKeyword palabra clave del usuario que se este buscando
 */
export async function getUsersListAPI(sessionUserId, userKeyword){
    const data = {
        'session_user_id' : sessionUserId,
        'user_keyword' : userKeyword
    }
    return await axios.post(BACKEND_URL + `api/get_user_list/`, data, config)
}

