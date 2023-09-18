/**
 * Revisa la lista de notificaciones, y en caso de que alguna notificacion este relacionada con el usuario clickedUser
 * la retorna
 * @param {Number} clickedUserId id del usuario clickeado
 * @param {Array} notificationsList array de notificaciones
 */
export function getRelatedNotification(clickedUserId, notificationsList){
    for (let i =0; i <= notificationsList.length ; i++){
        if (notificationsList[i].sender_user.id == clickedUserId){
            return notificationsList[i]
        }
    }
    return null
}