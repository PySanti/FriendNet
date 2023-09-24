import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {refreshTokenAPI} from "../api/refreshToken.api"
import {BASE_UNEXPECTED_ERROR_MESSAGE, UNAUTHORIZED_STATUS_CODE, JWT_LOCALSTORAGE_NAME, BASE_LOGIN_REQUIRED_ERROR_MSG} from "../utils/constants"

/**
 * Refrescara el token del usuario y setea su valor en el localStorage. 
 * 
 *  true : En caso de que todo este bien
 *  "requires_login" : En caso de que haya que logear nuevamente al usuario
 * "unexpected_error": en caso de que haya algun error inesperado
 */
export async function refreshToken() {
    console.log('Refrescando token')
    try {
        const response = await refreshTokenAPI(getJWTFromLocalStorage().refresh)
        localStorage.setItem(JWT_LOCALSTORAGE_NAME, JSON.stringify(response.data))
    } catch(error) {
        if (error.response.status === UNAUTHORIZED_STATUS_CODE){
            console.log('Token de refresco expirado')
            return BASE_LOGIN_REQUIRED_ERROR_MSG
        } else {
            return BASE_UNEXPECTED_ERROR_MESSAGE
        }
    }
    return true
}