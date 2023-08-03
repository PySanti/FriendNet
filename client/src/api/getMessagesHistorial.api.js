import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { config } from "./baseConfig.api";


/**
 * Llama a la api para recibir chat entre id1 y id2 (historial de mensajes)
 * @param {String} id1    
 * @param {String} id2
 */

export async function getMessagesHistorialAPI(receiver_id, accessToken){
    const data = {
        "receiver_id" :receiver_id,
    }
    config.headers = {
        "Authorization" : `Bearer ${accessToken}`
    }
    return await axios.post(BACKEND_URL+"api/get_messages_historial/",data, config)
}

