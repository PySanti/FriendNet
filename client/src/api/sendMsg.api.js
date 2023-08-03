import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'
import { config } from './baseConfig.api'
/**
 * Envia un mensaje desde sender_user hasta receiver_user
 * @param {Number} sender_id 
 * @param {Number} receiver_id
 * @param {String} msg
 */
export async function sendMsgAPI(receiver_id, msg, accessToken){
    const data =     {
        "receiver_id" : receiver_id,
        "msg" : msg
    }
    config.headers = {
        "Authorization" : `Bearer ${accessToken}`
    }
    return await axios.post(BACKEND_URL + `api/send_msg/`,data, config)
}