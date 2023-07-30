import jwt_decode from "jwt-decode";

/**
 * Retorna el nombre del usuario almacenado en el AuthToken del Local Storage
 */
export function getUsernameFromLocalStorage(){
    return jwt_decode(localStorage.getItem('authToken')).username
}