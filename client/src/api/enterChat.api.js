import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { config } from "./baseConfig.api";


/**
 * Llama a la api para recibir info necesaria para apertura de chat 
 * @param {Number} receiverId  
 * @param {Number} relatedNotificationId  
 * @param {Number} accessToken
 */
export async function enterChatAPI(receiverId, relatedNotificationId, accessToken){
    const data = {
        'receiver_id' : receiverId,
        'related_notification_id' : relatedNotificationId
    }
    config.headers = {
        'Authorization' : `Bearer ${accessToken}`
    }
    return await axios.post(BACKEND_URL + 'api/enter_chat/?page=1', data, config)
}


