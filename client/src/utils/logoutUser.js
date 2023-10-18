import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {disconnectWebsocket} from "../utils/disconnectWebsocket"
/**
 * Funcion creada para modularizar la funcionalidad de deslogueo
 * @param {Function} navigateFunc referencia a la funcion para redirijir al usuario al root
 */
export function logoutUser(navigateFunc){
    localStorage.clear()
    if (navigateFunc){
        disconnectWebsocket(NOTIFICATIONS_WEBSOCKET)
        navigateFunc('/')
    } else {
        window.location.href("/")
    }
}