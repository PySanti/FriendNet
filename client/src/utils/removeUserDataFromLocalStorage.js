/**
 * Esta funcion eliminara los datos del usuario almacenados en el localStorage,
 * pensada para ser ejecutada cuando el usuario se deslogee 
 */
export function removeUserDataFromLocalStorage(){
    localStorage.removeItem('userData')
}