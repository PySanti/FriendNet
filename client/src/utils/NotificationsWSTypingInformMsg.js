import {getUserDataFromLocalStorage} from "./getUserDataFromLocalStorage"
export function NotificationsWSTypingInformMsg(clickedUserId, typing){
    return JSON.stringify({
        "type" : "typing_inform",
        "value" : {
            "clicked_user_id" : clickedUserId,
            "session_user_id" : getUserDataFromLocalStorage().id,
            "typing" : typing
        }
    
})
}