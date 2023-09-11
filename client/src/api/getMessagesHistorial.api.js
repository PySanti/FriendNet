import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { config } from "./baseConfig.api";


/**
 * Llama a la api para recibir chat entre id1 y id2 (historial de mensajes)
 * @param {String} receiverId id del segundo integrante del chat 
 * @param {String} accessToken
 * @param {Number} page pagina actual de lista de mensajes
 */

export async function getMessagesHistorialAPI(receiverId, accessToken, page){
    const data = {
        "receiver_id" :receiverId,
    }
    config.headers = {
        "Authorization" : `Bearer ${accessToken}`
    }
    return await axios.post(BACKEND_URL+`api/get_messages_historial/?page=${page}`,data, config)
}

