import getNotificationsFromLocalStorage from "./getNotificationsFromLocalStorage"


export function initializeNotifications(notifications, notificationsSetter){
    const localStorageNotifications = getNotificationsFromLocalStorage()
    if (notifications.length == 0 && localStorageNotifications){
        notificationsSetter(localStorageNotifications)
    }
}