import {NotificationsWSTypingInformMsg} from "./NotificationsWSTypingInformMsg"
import {BASE_USER_TYPING_LOCAL_STORAGE_ATTR} from "../utils/constants"
/**
 * Revisa si el Websocket esta inicializado y si lo esta lo desconecta y anula
 * @param {Object} websocket
 */
export function disconnectWebsocket(websocket){
    console.log('Desconectando websocket')
    if (websocket.current){
        if (localStorage.getItem(BASE_USER_TYPING_LOCAL_STORAGE_ATTR)){
            // caso borde en el que el usuario se haya desconectado antes de los 600ms despues de haber escrito
            websocket.current.send(NotificationsWSTypingInformMsg(Number(localStorage.getItem("user_typing")), false))
        }
        websocket.current.close() 
        websocket.current = null
    }
}