import { config } from './baseConfig.api'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'

/**
 *  Llama a api para eliminacion de notificaciones
 * @param {Number} notificationId id de la notificacion a eliminar  
 * @param {String} accessToken 
 */
export async function notificationDeleteAPI(notificationId, accessToken){
    config.headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization' : `Bearer ${accessToken}`
    }
    const data = {
        "notification_id" : notificationId
    }
    return await axios.post(BACKEND_URL + `api/notification/delete/`,data, config)
}
