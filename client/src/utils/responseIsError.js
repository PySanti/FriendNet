/**
 * Recibe el response retornado por la funcion executeSecuredApi y el status con el que se consideraria valida la respuesta de la api
 * 
 * Retornara true si la respuesta es producto de un error o false en caso de que sea valida
 */
export function responseIsError(response, validStatus){
    response === "unexpected_error" || response.status != validStatus
}