
/**
 * Retorna los datos del usuario almacenados en el almacenamiento local
 */
export function getUserDataFromLocalStorage(){
    return JSON.parse(localStorage.getItem('userData'))
}