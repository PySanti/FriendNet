import {MESSAGES_WEBSOCKET} from "../utils/constants"
import {MESSAGES_WEBSOCKET_ENDPOINT} from "../utils/constants"
import {MessagesWSGroupCreationMsg} from "../utils/MessagesWSGroupCreationMsg"
import {MessagesWSGroupName} from "../utils/MessagesWSGroupName"
/**
 * Inicializa el websocket de las notificaciones
 */
export function MessagesWSInitialize(sessionUserId, clickedUserId){
    MESSAGES_WEBSOCKET.current = new WebSocket(MESSAGES_WEBSOCKET_ENDPOINT);
    MESSAGES_WEBSOCKET.current.onopen = () => {
        MESSAGES_WEBSOCKET.current.send(MessagesWSGroupCreationMsg(MessagesWSGroupName(sessionUserId, clickedUserId)))
    };
}