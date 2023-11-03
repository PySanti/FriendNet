import {redirectExpiredUser} from "../utils/redirectExpiredUser"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {refreshTokenAPI} from "../api/refreshToken.api"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_UNEXPECTED_ERROR_MESSAGE, UNAUTHORIZED_STATUS_CODE, JWT_LOCALSTORAGE_NAME, BASE_LOGIN_REQUIRED_ERROR_MSG} from "../utils/constants"


/**
 * Funcion creada para estandarizar el protocolo de ejecucion de tanto api's normales
 * como api's seguras. Creado tambien para estandarizar comportamiento para mensajes de error
 * comunes
*/
export async function executeApi(apiCallingFunction, navigateFunc, loadingStateSetter){
    let response = undefined
    const condition = true
    while(condition){
        try{
            response = await apiCallingFunction() 
            break
        } catch(error){
            if (error.message == BASE_FALLEN_SERVER_ERROR_MSG || error.response.status !== 401){
                return error.message == BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_ERROR_MSG :  error.response
            } else if (error.response.status === 401){ // error por token
                try {
                    const response = await refreshTokenAPI(getJWTFromLocalStorage().refresh)
                    localStorage.setItem(JWT_LOCALSTORAGE_NAME, JSON.stringify(response.data))
                } catch(error) {
                    if (error.response.status === UNAUTHORIZED_STATUS_CODE){
                        redirectExpiredUser(navigateFunc)
                        return undefined
                    } else {
                        return error.message == BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_ERROR_MSG : BASE_UNEXPECTED_ERROR_MESSAGE 
                    }
                }
            } else {
                return BASE_UNEXPECTED_ERROR_MESSAGE
            }
        }
    }
    return response
}