import {getNotificationsFromLocalStorage} from "./getNotificationsFromLocalStorage"


export function initializeNotificationsList(notifications, notificationsSetter){
    const localStorageNotifications = getNotificationsFromLocalStorage()
    if (Object.keys(notifications).length == 0 && localStorageNotifications){
        notificationsSetter(localStorageNotifications)
    }
}