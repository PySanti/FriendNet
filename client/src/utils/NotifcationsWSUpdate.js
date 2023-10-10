import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {saveNotificationsInLocalStorage} from "../utils/saveNotificationsInLocalStorage"
import {logoutUser} from "../utils/logoutUser"
/**
 * Se encargara de actualizar el soporte para recepcion de notification broadcasting
 */
export function NotificationsWSUpdate(sessionUserId, newNotifications, notificationsSetter, navigateFunc, usersList,  setUsersList){
    NOTIFICATIONS_WEBSOCKET.current.onmessage = (event)=>{
        const data = JSON.parse(event.data)
        console.log('Recibiendo datos a traves del websocket de notificaciones')
        console.log(data)
        if (data.type == "new_notification"){
            if (data.new_notification.sender_user.id != sessionUserId){
                const updatedNotifications = [...newNotifications, data.new_notification]
                notificationsSetter(updatedNotifications)
                saveNotificationsInLocalStorage(updatedNotifications)
            }
        } else if (data.type == "connection_error"){
            logoutUser(navigateFunc)
        } else  if (data.type === "updated_clicked_user"){
            console.log('Recibiendo informacion de usuario actualizado')
            console.log(data)

        }
    }
}