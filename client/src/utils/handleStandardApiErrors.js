import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_RATE_LIMIT_BLOCK_RESPONSE} from "../utils/constants"
import {toast} from "sonner"
/**
 * Funcion creada para estandarizar mensajes de error 
 * 
 * Retornara true en caso de que se logre manejar el error, false en caso contrario
 */
export function handleStandardApiErrors(error){
    if (error.message === BASE_FALLEN_SERVER_ERROR_MSG  || error.response.status == 403){
        toast.error(error.message === BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : BASE_RATE_LIMIT_BLOCK_RESPONSE)
        return true;
    } else {
        return false;
    }
}