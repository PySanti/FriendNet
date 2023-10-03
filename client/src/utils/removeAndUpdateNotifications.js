import {removeNotificationFromLocalStorage} from "./removeNotificationFromLocalStorage"
import {saveNotificationsInLocalStorage} from "./saveNotificationsInLocalStorage"

export function removeAndUpdateNotifications(notification, notificationsSetter){
    const updatedNotifications = removeNotificationFromLocalStorage(notification)
    saveNotificationsInLocalStorage(updatedNotifications)
    notificationsSetter(updatedNotifications)
}