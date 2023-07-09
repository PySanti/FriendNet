import axios from 'axios'
import { BACKEND_URL } from '../main'
/**
 * Llama a api que retorna notificaciones de usuario
 * @param {Number} user_id
 */
export async function getUserNotifications(user_id){
    return await axios.get(BACKEND_URL + `api/get_user_notifications/${user_id}`)
}

