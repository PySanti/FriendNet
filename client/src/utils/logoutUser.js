import {disconnectUserAPI} from "../api/disconnectUser.api"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
/**
 * Llama a api para desconexion de usuario y limpia los datos del usuario
 * del localStorage
 * @param {Boolean} disconnectUser sera true en caso de que se desee llamar a api para desconectar usuario
 */
export async function logoutUser(){
    await disconnectUserAPI(getJWTFromLocalStorage().access)
    localStorage.clear()
}