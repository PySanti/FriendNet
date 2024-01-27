/**
 * Almacena las notificaciones del usuario en el Local Storage
 * @param {Array} notifications lista de notificationes
 */

export function saveNotificationsInLocalStorage(notifications){
    localStorage.setItem('notifications', JSON.stringify(notifications))
}