import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"

/**
 * Funcion creada para setear en el NotificationsWS codigo para
 * responder a los mensajes del backend de manera prioritaria
 */
export function NotificationsWSSetPriorityMsgReception(setNotificationsIdsCached){
    NOTIFICATIONS_WEBSOCKET.current.onmessage = (event)=>{
        const data = JSON.parse(event.data)
        console.log(data)
        if (data.type === "notifications_ids_cached_inform"){
            setNotificationsIdsCached(true)
        }
    }
}