import {redirectExpiredUser} from "../utils/redirectExpiredUser"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {refreshTokenAPI} from "../api/refreshToken.api"
import {JWT_LOCALSTORAGE_NAME} from "../utils/constants"
import {handleStandardApiErrors} from "./handleStandardApiErrors"

/**
 * Funcion creada para estandarizar el protocolo de ejecucion de tanto api's normales
 * como api's seguras. Creado tambien para estandarizar comportamiento para mensajes de error
 * comunes.
 * 
 * Retornara false en caso de que ya se haya manejado la respuesta de la api
*/
export async function executeApi(apiCallingFunction, navigateFunc, loadingStateSetter){
    let response = undefined
    const condition = true
    while(condition){
        try{
            response = await apiCallingFunction() 
            break
        } catch(error){
            if (!handleStandardApiErrors(error, loadingStateSetter)){
                if (error.response.status === 401){ // error por token
                    try {
                        const response = await refreshTokenAPI(getJWTFromLocalStorage().refresh)
                        localStorage.setItem(JWT_LOCALSTORAGE_NAME, JSON.stringify(response.data))
                    } catch(error) {
                        redirectExpiredUser(navigateFunc)
                        return false
                    }
                } else {
                    return error.response
                }
            } else {
                return false
            }
        }
    }
    return response
}