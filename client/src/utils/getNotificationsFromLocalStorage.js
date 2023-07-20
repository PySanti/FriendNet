/**
 * Retorna las notificaciones almacenadas en el local storage
 */
export function getNotificationsFromLocalStorage(){
    return JSON.parse(localStorage.getItem('notifications'))
}