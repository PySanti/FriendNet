import {getUserDataFromLocalStorage} from "./getUserDataFromLocalStorage"
import {NotificationsWSInitialize} from "./NotificationsWSInitialize"
import {initializeNotificationsList} from "./initializeNotificationsList"

export function initStates(notifications, setNotifications){
    if (getUserDataFromLocalStorage()){
        NotificationsWSInitialize(getUserDataFromLocalStorage().id)
        initializeNotificationsList(notifications, setNotifications)
    }
}