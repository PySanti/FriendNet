import {redirectExpiredUser} from "../utils/redirectExpiredUser"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {refreshTokenAPI} from "../api/refreshToken.api"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_UNEXPECTED_ERROR_MESSAGE, UNAUTHORIZED_STATUS_CODE, JWT_LOCALSTORAGE_NAME, BASE_LOGIN_REQUIRED_ERROR_MSG} from "../utils/constants"


/**
 * Recibira una funcion que retornara la respuesta de la llamada a la target api que se desea ejecutar y realizara los
 * procesos necesarios para la ejecucion de una api segura, retornara la 
 * respuesta de la api o redirijira al usuario
 * 
 * La funcion retornara:
 *  la respuesta de la api en caso de que todo haya salido bien
 *  la respuesta de la api en caso de que haya habido un error con ella
 *  undefined en caso de que se haya redirigido al usuario
 *  BASE_UNEXPECTED_ERROR_MSG en caso de que haya habido un error inesperado con la api de refresco del token (caso muy poco comun)
*   BASE_FALLEN_SERVER_ERROR_MSG en caso de que el server este caido 
*/
export async function executeSecuredApi(apiCallingFunction, navigateFunc){
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
            } 
        }
    }
    return response
}