import {refreshToken} from "../utils/refreshToken"
import {redirectExpiredUser} from "../utils/redirectExpiredUser"
import {BASE_LOGIN_REQUIRED_ERROR_MSG} from "../utils/constants"
import {BASE_FALLEN_SERVER_ERROR_MSG} from "../utils/constants"
/**
 * Recibira un wrap de la funcion que se desea ejecutar y realizara los
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
            // en este punto, el error puede ser : por api, por token o por servidor caido
            if (error.message == BASE_FALLEN_SERVER_ERROR_MSG){ // server caido
                response = BASE_FALLEN_SERVER_ERROR_MSG
                break
            } else if (error.response.status === 401){ // token
                console.log('El token no es valido')
                const refreshingResponse = await refreshToken()
                if (refreshingResponse === BASE_LOGIN_REQUIRED_ERROR_MSG){
                    redirectExpiredUser(navigateFunc)
                    break
                } else if (refreshingResponse !== true){
                    response = refreshingResponse
                    break
                }
            } else { // api
                response = error.response
                break
            }
        }
    }
    return response
}