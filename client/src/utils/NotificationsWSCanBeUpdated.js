import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
export function NotificationsWSCanBeUpdated(){
    return NOTIFICATIONS_WEBSOCKET.current && getUserDataFromLocalStorage()
}