import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
/**
 * Se encargara de actualizar el soporte para recepcion de notification broadcasting
 */
export function NotificationsWSUpdate(newNotifications, notificationsSetter){
    NOTIFICATIONS_WEBSOCKET.current.onmessage = (event)=>{
        const data = JSON.parse(event.data)
        console.log('Recibiendo datos a traves del websocket de notificaciones')
        console.log(data)
        notificationsSetter([...newNotifications, data])
    }
}