import {UNAUTHORIZED_STATUS_CODE} from "../utils/constants"
import {verifyJWTAPI} from "../api/verifyJWT.api"
import { getJWTFromLocalStorage } from "../utils/getJWTFromLocalStorage"
import {refreshToken} from "../utils/refreshToken"

/**
 * Llama a api para verificacion de JWT, en caso de ser invalido el JWT lo refresca.
 * 
 * Retornara:
 *  true : En caso de que todo este bien
 *  BASE_LOGIN_REQUIRED_ERROR_MSG : En caso de que haya que logear nuevamente al usuario
 *  "unexpected_error" : En caso de que haya algun error inesperado
 * @param {Function} refreshTokenFunc
 */
export async function validateJWT(){
    try{
        await verifyJWTAPI(getJWTFromLocalStorage().access)
        console.log('Token valido')
    } catch(error){
        if (error.response.status === UNAUTHORIZED_STATUS_CODE){
            console.log('Token expirado')
            return await refreshToken()
        } else {
            return "unexpected_error"
        }
    }
    return true
}