import axios from "axios";
import { BACKEND_URL } from "../main";
import { config } from "./baseConfig.api";


/**
 * Llama a la api para recibir chat entre id1 y id2 (historial de mensajes)
 * @param {String} id1    
 * @param {String} id2
 */

export async function getMessagesHistorialAPI(id1, id2){
    const data = {
        "id_1" :id1,
        "id_2" :id2,
    }
    return await axios.post(BACKEND_URL+"api/get_messages_historial/",data, config)
}

