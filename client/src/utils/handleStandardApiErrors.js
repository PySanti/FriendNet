import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_RATE_LIMIT_BLOCK_RESPONSE} from "../utils/constants"

/**
 * Funcion creada para estandarizar mensajes de error que se setearan
 * en el loadingStateSetter para DRY.
 * 
 * Retornara true en caso de que se logre manejar el error, false en caso contrario
 */
export function handleStandardApiErrors(error, loadingStateSetter){
    if (error.message === BASE_FALLEN_SERVER_ERROR_MSG  || error.response.status == 403){
        loadingStateSetter(error.message === BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : BASE_RATE_LIMIT_BLOCK_RESPONSE)
        return true;
    } else {
        return false;
    }
}