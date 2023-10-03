import {removeNotificationFromLocalStorage} from "../utils/remove&UpdateNotifications"
import {saveNotificationsInLocalStorage} from "../utils/saveNotificationsInLocalStorage"

export function removeAndUpdateNotifications(notification, notificationsSetter){
    const updatedNotifications = removeNotificationFromLocalStorage(notification)
    saveNotificationsInLocalStorage(updatedNotifications)
    notificationsSetter(updatedNotifications)
}