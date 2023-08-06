import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {refreshTokenAPI} from "../api/refreshToken.api"
import {UNAUTHORIZED_STATUS_CODE} from "../utils/constants"
/**
 * Refrescara el token del usuario y setea su valor en el localStorage. En caso de que el refresh
 * token este caducado, retorna true, en caso contrario false
 */
export async function refreshToken() {
    console.log('Refrescando token')
    try {
        const response = await refreshTokenAPI(getJWTFromLocalStorage().refresh)
        localStorage.setItem('authToken', JSON.stringify(response.data))
    } catch(error) {
        if (error.response.status === UNAUTHORIZED_STATUS_CODE){
            return false
        }
    }
    return true
}