import {BASE_RATE_LIMIT_BLOCK_RESPONSE, BASE_FALLEN_SERVER_ERROR_MSG, BASE_UNEXPECTED_ERROR_LOG, BASE_UNEXPECTED_ERROR_MESSAGE, BASE_FALLEN_SERVER_LOG} from "../utils/constants"

/**
 * Funcion creada para estandarizar mensajes de error que se setearan
 * en el loadingStateSetter para DRY
 */
export function handleStandardApiErrors(response, loadingStateSetter, unexpectedErrorMsg){
    console.log('Recibiendo error al handleStandard')
    console.log(response)
    if (response == undefined){
        loadingStateSetter(BASE_FALLEN_SERVER_LOG)
    } else {
        if (response == BASE_FALLEN_SERVER_ERROR_MSG || response == BASE_UNEXPECTED_ERROR_MESSAGE){
            loadingStateSetter(response == BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : BASE_UNEXPECTED_ERROR_LOG)
        } else if (response.status == 403){
            loadingStateSetter(BASE_RATE_LIMIT_BLOCK_RESPONSE)
        } else {
            loadingStateSetter(unexpectedErrorMsg)
        }
    }
}