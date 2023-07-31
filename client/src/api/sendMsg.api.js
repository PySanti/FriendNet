import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'
import { config } from './baseConfig.api'
/**
 * Envia un mensaje desde sender_user hasta receiver_user
 * @param {Number} sender_id 
 * @param {Number} receiver_id
 * @param {String} msg
 */
export async function sendMsgAPI(receiver_id, sender_id, msg){
    const data =     {
        "receiver_id" : receiver_id,
        "sender_id" : sender_id,
        "msg" : msg
    }
    return await axios.post(BACKEND_URL + `api/send_msg/`,data, config)
}