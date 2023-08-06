import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {refreshTokenAPI} from "../api/refreshToken.api"
import {UNAUTHORIZED_STATUS_CODE, JWT_LOCALSTORAGE_NAME} from "../utils/constants"
/**
 * Refrescara el token del usuario y setea su valor en el localStorage. En caso de que el refresh
 * token este caducado, retorna true, en caso contrario false
 */
export async function refreshToken() {
    console.log('Refrescando token')
    try {
        const response = await refreshTokenAPI(getJWTFromLocalStorage().refresh)
        localStorage.setItem(JWT_LOCALSTORAGE_NAME, JSON.stringify(response.data))
    } catch(error) {
        if (error.response.status === UNAUTHORIZED_STATUS_CODE){
            return false
        }
    }
    return true
}