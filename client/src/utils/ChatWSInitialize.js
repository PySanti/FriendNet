import {CHAT_WEBSOCKET} from "../utils/constants"
import {CHAT_WEBSOCKET_ENDPOINT} from "../utils/constants"
import {ChatWSGroupCreationMsg} from "../utils/ChatWSGroupCreationMsg"
import {ChatWSGroupName} from "../utils/ChatWSGroupName"
/**
 * Inicializa el websocket de las notificaciones
 */
export function ChatWSInitialize(sessionUserId, clickedUserId){
    CHAT_WEBSOCKET.current = new WebSocket(CHAT_WEBSOCKET_ENDPOINT);
    CHAT_WEBSOCKET.current.onopen = () => {
        CHAT_WEBSOCKET.current.send(ChatWSGroupCreationMsg(ChatWSGroupName(sessionUserId, clickedUserId)))
    };
}