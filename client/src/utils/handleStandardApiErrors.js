import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_RATE_LIMIT_BLOCK_RESPONSE} from "../utils/constants"

/**
 * Funcion creada para estandarizar mensajes de error que se setearan
 * en el loadingStateSetter para DRY.
 * 
 * Retornara true en caso de que se logre manejar el error, false en caso contrario
 */
export function handleStandardApiErrors(response, loadingStateSetter){
    const is_fallen_server = response === BASE_FALLEN_SERVER_ERROR_MSG || response.message === BASE_FALLEN_SERVER_ERROR_MSG 
    if (is_fallen_server || response.status == 403){
        loadingStateSetter(is_fallen_server ? BASE_FALLEN_SERVER_LOG : BASE_RATE_LIMIT_BLOCK_RESPONSE)
        return true;
    } else {
        return false;
    }
}