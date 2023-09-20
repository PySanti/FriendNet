import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {saveNotificationsInLocalStorage} from "../utils/saveNotificationsInLocalStorage"
/**
 * Se encargara de actualizar el soporte para recepcion de notification broadcasting
 */
export function NotificationsWSUpdate(sessionUserId, newNotifications, notificationsSetter){
    NOTIFICATIONS_WEBSOCKET.current.onmessage = (event)=>{
        const data = JSON.parse(event.data)
        console.log('Recibiendo datos a traves del websocket de notificaciones')
        console.log(data)
        const updatedNotifications = [...newNotifications, data]
        if (data.sender_user.id != sessionUserId){
            notificationsSetter(updatedNotifications)
        }
        saveNotificationsInLocalStorage(updatedNotifications)
    }
}