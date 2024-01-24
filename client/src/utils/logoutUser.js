import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {disconnectWebsocket} from "../utils/disconnectWebsocket"
import {clearLocalStorage} from "../utils/clearLocalStorage"
import {toast} from "sonner"
/**
 * Funcion creada para modularizar la funcionalidad de deslogueo
 * @param {Function} navigateFunc referencia a la funcion para redirijir al usuario al root
 */
export function logoutUser(navigateFunc){
    clearLocalStorage()
    if (navigateFunc){
        disconnectWebsocket(NOTIFICATIONS_WEBSOCKET)
        navigateFunc('/')
    } else {
        window.location.href = "/"
    }
    toast.success("Sesión finalizada")
}