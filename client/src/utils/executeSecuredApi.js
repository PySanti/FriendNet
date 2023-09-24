import {refreshToken} from "../utils/refreshToken"
import {redirectExpiredUser} from "../utils/redirectExpiredUser"
import {BASE_LOGIN_REQUIRED_ERROR_MSG} from "../utils/constants"

/**
 * Recibira un wrap de la funcion que se desea ejecutar y realizara los
 * procesos necesarios para la ejecucion de una api segura, retornara la 
 * respuesta de la api o redirijira al usuario
 * 
 * La funcion retornara:
 *  la respuesta de la api en caso de que todo haya salido bien
 *  la respuesta de la api en caso de que haya habido un error con ella
 *  undefined en caso de que se haya redirigido al usuario
 *  "unexpected_error" en caso de que haya habido un error inesperado con la api de refresco del token (caso muy poco comun)
 */
export async function executeSecuredApi(apiCallingFunction, navigateFunc){
    let response = undefined
    const condition = true
    while(condition){
        try{
            response = await apiCallingFunction() 
            break
        } catch(error){
            if (error.response.status === 401){
                console.log('El token no es valido')
                const successValidating = await refreshToken()
                if (successValidating === BASE_LOGIN_REQUIRED_ERROR_MSG){
                    redirectExpiredUser(navigateFunc)
                    break
                } else if (successValidating !== true){
                    response = successValidating
                    break
                }
            } else {
                response = error
                break
            }
        }
    }
    return response
}