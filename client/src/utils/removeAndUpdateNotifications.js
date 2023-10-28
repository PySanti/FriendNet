import {removeNotificationFromLocalStorage} from "./removeNotificationFromLocalStorage"

/**
 * Esta funcion se encargara de eliminar la notification del localStorage y guardar
 * las notificaciones actualizadas en el mismo localStorage y en el notificationsState
 */
export function removeAndUpdateNotifications(notification, notificationsSetter){
    const updatedNotifications = removeNotificationFromLocalStorage(notification)
    notificationsSetter(updatedNotifications)
}