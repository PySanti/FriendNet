import {CHAT_WEBSOCKET} from "../utils/constants"
import {CHAT_WEBSOCKET_ENDPOINT} from "../utils/constants"
import {ChatWSGroupCreationMsg} from "../utils/ChatWSGroupCreationMsg"
/**
 * Inicializa el websocket del chat cuando se clickea un usuario por primera vez
 */
export function ChatWSInitialize(clickedUserId){
    CHAT_WEBSOCKET.current = new WebSocket(CHAT_WEBSOCKET_ENDPOINT);
    CHAT_WEBSOCKET.current.onopen = () => {
        CHAT_WEBSOCKET.current.send(ChatWSGroupCreationMsg(clickedUserId))
    };
}