import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {NOTIFICATIONS_WEBSOCKET_ENDPOINT} from "../utils/constants"
import {NotificationsWSGroupCreationMsg} from "../utils/NotificationsWSGroupCreationMsg"
import {NotificationsWSConnectionInformMessage} from "../utils/NotificationsWSConnectionInformMessage"
/**
 * Inicializa el websocket de notificaciones
 */
export function NotificationsWSInitialize(userId){
    NOTIFICATIONS_WEBSOCKET.current = new WebSocket(NOTIFICATIONS_WEBSOCKET_ENDPOINT)
    NOTIFICATIONS_WEBSOCKET.current.onopen = ()=>{
        console.log('Estableciendo conexion')
        NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSGroupCreationMsg(userId))
        NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSConnectionInformMessage(userId, true))
    }
}