import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { config } from "./baseConfig.api";


/**
 * Llama a la api para cambiar old_password por new_password 
 * @param {String} oldPwd  
 * @param {String} newPwd  
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


