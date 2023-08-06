import {UNAUTHORIZED_STATUS_CODE} from "../utils/constants"
import {verifyJWTAPI} from "../api/verifyJWT.api"
import { getJWTFromLocalStorage } from "../utils/getJWTFromLocalStorage"
import {refreshToken} from "../utils/refreshToken"

/**
 * Llama a api para verificacion de JWT, en caso de ser invalido el JWT lo refresca.
 * 
 * En caso de que no haya ningun error, retornara true, en caso contrario, false
 * @param {Function} refreshTokenFunc
 */
export async function validateJWT(){
    try{
        await verifyJWTAPI(getJWTFromLocalStorage().access)
        console.log('Token valido')
    } catch(error){
        if (error.response.status === UNAUTHORIZED_STATUS_CODE){
            console.log('Token expirado')
            await refreshToken()
            console.log('Token refrescado con exito')
        } else {
            return false
        }
    }
    return true
}