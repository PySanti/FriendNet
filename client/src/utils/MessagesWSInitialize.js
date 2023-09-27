import {CHAT_WEBSOCKET} from "../utils/constants"
import {CHAT_WEBSOCKET_ENDPOINT} from "../utils/constants"
import {MessagesWSGroupCreationMsg} from "../utils/MessagesWSGroupCreationMsg"
import {MessagesWSGroupName} from "../utils/MessagesWSGroupName"
/**
 * Inicializa el websocket de las notificaciones
 */
export function MessagesWSInitialize(sessionUserId, clickedUserId){
    CHAT_WEBSOCKET.current = new WebSocket(CHAT_WEBSOCKET_ENDPOINT);
    CHAT_WEBSOCKET.current.onopen = () => {
        CHAT_WEBSOCKET.current.send(MessagesWSGroupCreationMsg(MessagesWSGroupName(sessionUserId, clickedUserId)))
    };
}