/**
 * Revisa la lista de notificaciones, y en caso de que alguna notificacion este relacionada con el usuario clickedUser, las elimina y retorna la lista actualizada
 * en caso contrario false
 */

export function removeRelatedNotifications(clickedUserId, notificationsList){
    let relatedNotificacionsIndex = []
    for (let i = notificationsList.length-1; i !== -1 ; i--){
        if (notificationsList[i].code == clickedUserId){
            relatedNotificacionsIndex.push(i)
        }
    }
    relatedNotificacionsIndex.forEach((index)=>{
        notificationsList.splice(index, 1)
    })
    return relatedNotificacionsIndex ? notificationsList : null
}