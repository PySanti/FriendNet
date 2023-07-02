import axios from 'axios'
import { BACKEND_URL } from '../main'
import { config } from './baseConfig.api'
/**
 * Llama a api que retorna lista de usuarios de la pagina
 */
export async function getUsersListAPI(){
    return await axios.get(BACKEND_URL + `api/get_user_list/`)
}

