import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'
import { config } from './baseConfig.api'
/**
 * Envia un mensaje desde sender_user hasta receiver_user
 * @param {String} accessToken 
 * @param {Number} receiverId
 * @param {String} msg
 * @param {Boolean} createNotification
 */
export async function sendMsgAPI(receiverId, msg, createNotification, accessToken){
    const data =     {
        "receiver_id" : receiverId,
        "msg" : msg,
        "create_notification" : createNotification
    }
    config.headers = {
        "Authorization" : `Bearer ${accessToken}`
    }
    return await axios.post(BACKEND_URL + `api/send_msg/`,data, config)
}