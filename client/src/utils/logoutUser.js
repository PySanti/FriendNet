import {disconnectUserAPI} from "../api/disconnectUser.api"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
/**
 * Llama a api para desconexion de usuario y limpia los datos del usuario
 * del localStorage
 */
export async function logoutUser(){
    await disconnectUserAPI(getJWTFromLocalStorage().access)
    localStorage.clear()
}