import axios from 'axios'
import { BACKEND_URL } from '../main'
/**
 * Llama a api para eliminar notificacion
 * @param {Number} notificacion_id 
 */
export async function removeNotificationAPI(notificacion_id){
    return await axios.delete(BACKEND_URL + `api/remove_notification/${notificacion_id}`)
}

