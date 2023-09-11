/**
 * Revisa la lista de notificaciones, y en caso de que alguna notificacion este relacionada con el usuario clickedUser, las elimina y retorna la lista actualizada
 * en caso contrario false
 * @param {Number} clickedUserId id del usuario clickeado
 * @param {Array} notificationsList array de notificaciones
 */
export function removeRelatedNotifications(clickedUserId, notificationsList){
    let relatedNotificacionsIndex = []
    for (let i = notificationsList.length-1; i !== -1 ; i--){
        if (notificationsList[i].sender_user.id == clickedUserId){
            relatedNotificacionsIndex.push(i)
        }
    }
    relatedNotificacionsIndex.forEach((index)=>{
        notificationsList.splice(index, 1)
    })
    return relatedNotificacionsIndex ? notificationsList : null
}