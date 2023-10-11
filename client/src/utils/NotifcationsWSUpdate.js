import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {saveNotificationsInLocalStorage} from "../utils/saveNotificationsInLocalStorage"
import {logoutUser} from "../utils/logoutUser"
/**
 * Se encargara de actualizar el soporte para recepcion de notification broadcasting
 */
export function NotificationsWSUpdate(sessionUserId, newNotifications, notificationsSetter, navigateFunc, usersList,  setUsersList, setClickedUser, clickedUser){
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
            setUsersList(usersList.map(user => {
                if (user.id == data.value.id){
                    return data.value
                } else {
                    return user
                }
            }))
            if (clickedUser && data.value.id == clickedUser.id){
                data.value.is_online = clickedUser.is_online
                setClickedUser(data.value)
            }
        }
    }
}