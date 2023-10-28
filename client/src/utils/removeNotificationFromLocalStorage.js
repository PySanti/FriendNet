import { getNotificationsFromLocalStorage } from "./getNotificationsFromLocalStorage";
import { saveNotificationsInLocalStorage } from "./saveNotificationsInLocalStorage";

/**
 * Elimina una notificacion de la lista de notificaciones del LocalStorage y retorna la nueva lista
 * 
 * Guardara la lista actualizada en el mismo localStorage
 * @param {Object} notification 
 */
export function removeNotificationFromLocalStorage(notification){
    const notifications = getNotificationsFromLocalStorage()
    for (let i = 0; i < notifications.length ; i++){
        if (notifications[i].id == notification.id){
            console.log(`Eliminando notificacion ${notifications[i].id}`)
            notifications.splice(i, 1)
        }
    }
    saveNotificationsInLocalStorage(notifications)
    return notifications
}