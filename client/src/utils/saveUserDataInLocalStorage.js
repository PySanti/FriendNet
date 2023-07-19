/**
 * Almacena datos del usuario en el Local Storage
 * @param {Object} userData datos del usuario
 */
export function saveUserDataInLocalStorage(userData){
    localStorage.setItem('userData',JSON.stringify(userData))
}