/**
 * Retorna el nombre del grupo creado por ambos id's
 * de acuerdo al estandar implementado
 */
export function wsGroupName(sessionUserId, clickedUserId){
    return sessionUserId < clickedUserId ? `${sessionUserId}-${clickedUserId}` : `${clickedUserId}-${sessionUserId}` 
}