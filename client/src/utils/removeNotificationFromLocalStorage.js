import { getNotificationsFromLocalStorage } from "./getNotificationsFromLocalStorage";
import { saveNotificationsInLocalStorage } from "./saveNotificationsInLocalStorage";

/**
 * Elimina una notificacion de la lista de notificaciones del LocalStorage y retorna la nueva lista
 * @param {Object} notification 
 */
export function removeNotificationFromLocalStorage(notification){
    const notifications = getNotificationsFromLocalStorage()
    notifications.pop(notification)
    saveNotificationsInLocalStorage(notifications)
    return notifications
}