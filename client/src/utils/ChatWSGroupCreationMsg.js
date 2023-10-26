/**
 * Recibe el id del usuario clikeado y retorna el mensaje que
 * sera enviado a traves del websocket para la creacion del grupo entre
 * el session user y el clickedUser 
 */
import {getUserDataFromLocalStorage} from "./getUserDataFromLocalStorage"
export function ChatWSGroupCreationMsg(clickedUserId){
    return JSON.stringify({
        'type' : 'group_creation',
        "value" : {
            'session_user_id' : getUserDataFromLocalStorage().id,
            'clicked_user_id' : clickedUserId
        }
    })
}