import {JWT_LOCALSTORAGE_NAME} from "../utils/constants"

/**
 * 
 * Retorna true en caso de que el usuario este autenticado
 */
export function userIsAuthenticated(){
    return localStorage.getItem(JWT_LOCALSTORAGE_NAME)
}