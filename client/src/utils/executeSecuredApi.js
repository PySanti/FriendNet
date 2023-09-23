import {refreshToken} from "../utils/refreshTokenAPI"
import {redirectExpiredUser} from "../utils/redirectExpiredUser"
import {BASE_LOGIN_REQUIRED_ERROR_MSG} from "../utils/constants"

/**
 * Recibira un wrap de la funcion que se desea ejecutar y realizara los
 * procesos necesarios para la ejecucion de una api segura, retornara la 
 * respuesta de la api o redirijira al usuario
 */
export async function executeSecuredApi(apiCallingFunction, navigateFunc){
    let response = undefined
    while(true){
        try{
            response = await apiCallingFunction() 
            break
        } catch(error){
            if (error.response.data === "token_not_valid"){
                const successValidating = await refreshToken()
                if (successValidating !== BASE_LOGIN_REQUIRED_ERROR_MSG){
                    redirectExpiredUser(navigateFunc)
                } else if (successValidating !== true){
                    response = successValidating
                    break
                }
            } else {
                response = error.response
                break
            }
            console.log(error.response.data.code)
        }
    }
    return response
}