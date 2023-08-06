import {JWT_LOCALSTORAGE_NAME} from "../utils/constants"
/**
 * Toma el JWT del local storage y lo retorna
 */
export function getJWTFromLocalStorage(){
    return JSON.parse(localStorage.getItem(JWT_LOCALSTORAGE_NAME))
}