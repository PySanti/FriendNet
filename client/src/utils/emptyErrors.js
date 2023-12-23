/**
 * Funcion creada para determinar que no hay errores 
 * en un formulario
 * 
 * @param {Object} errorsObj
 */
export function emptyErrors(errorsObj){
    return Object.keys(errorsObj).length == 0
}