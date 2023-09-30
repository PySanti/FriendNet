/**
 * Retorna las notificaciones almacenadas en el local storage
 */
export function getNotificationsFromLocalStorage(){
    console.log('Cargando notificcaciones del localStorage')
    return JSON.parse(localStorage.getItem('notifications'))
}