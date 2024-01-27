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
    delete notifications[notification.sender_user.id]
    saveNotificationsInLocalStorage(notifications)
    return notifications
}