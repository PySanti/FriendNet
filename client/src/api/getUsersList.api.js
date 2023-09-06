import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'
import { config } from './baseConfig.api'
/**
 * Llama a api que retorna lista de usuarios de la pagina
 * @param {Number} sessionUserId Id de usuario de sesion activa
 * @param {Number} userKeyword palabra clave del usuario que se este buscando
 */
export async function getUsersListAPI(userKeyword, sessionUserId, page){
    const data = {
        'user_keyword' : userKeyword,
        'session_user_id' : sessionUserId,
    }
    return await axios.post(BACKEND_URL + `api/get_user_list/?page=${page}`, data, config)
}

