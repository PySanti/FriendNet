import {NOTIFICATIONS_WEBSOCKET} from "./constants"
import {getUserDataFromLocalStorage} from "./getUserDataFromLocalStorage"
import {saveNotificationsInLocalStorage} from "./saveNotificationsInLocalStorage"
import {logoutUser} from "./logoutUser"

/**
 * Actualizara el soporte del websocket de notificaciones para recepcion de mensajes desde el backend
 */
export function NotificationsWSUpdate(notifications, setNotifications, navigate, setUsersList, usersList, clickedUser, setLastClickedUser, setClickedUser){
    const userData = getUserDataFromLocalStorage()
    NOTIFICATIONS_WEBSOCKET.current.onmessage = (event)=>{
        const data = JSON.parse(event.data)
        console.log('Recibiendo datos a traves del websocket de notificaciones')
        console.log(data)
        if (data.type == "new_notification"){
            if (data.value.new_notification.sender_user.id != userData.id){
                const updatedNotifications = [...notifications, data.value.new_notification]
                setNotifications(updatedNotifications)
                saveNotificationsInLocalStorage(updatedNotifications)
            }
        } else if (data.type == "connection_error"){
            logoutUser(navigate)
        } else  if (data.type === "updated_user"){
            setUsersList(usersList.map(user => { 
                return  user.id == data.value.id ? data.value : user;
            }))
            if (clickedUser && data.value.id == clickedUser.id){
                setLastClickedUser(clickedUser)
                data.value.is_online = clickedUser.is_online
                setClickedUser(data.value)
            }
        }
    }
}