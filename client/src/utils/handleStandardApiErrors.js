import {BASE_RATE_LIMIT_BLOCK_RESPONSE, BASE_FALLEN_SERVER_ERROR_MSG, BASE_UNEXPECTED_ERROR_LOG, BASE_UNEXPECTED_ERROR_MESSAGE, BASE_FALLEN_SERVER_LOG} from "../utils/constants"

export function handleStandardApiErrors(response, loadingStateSetter, unexpectedErrorMsg){
    if (response.status == 403){
        loadingStateSetter(BASE_RATE_LIMIT_BLOCK_RESPONSE)
    } else if (response == BASE_FALLEN_SERVER_ERROR_MSG || response == BASE_UNEXPECTED_ERROR_MESSAGE){
        loadingStateSetter({
            BASE_FALLEN_SERVER_ERROR_MSG : BASE_FALLEN_SERVER_LOG,
            BASE_UNEXPECTED_ERROR_MESSAGE : BASE_UNEXPECTED_ERROR_LOG
        }[response])
    } else {
        loadingStateSetter(unexpectedErrorMsg)
    }
}