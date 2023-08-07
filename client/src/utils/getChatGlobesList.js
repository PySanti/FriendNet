/**
 * Recibe la lista de notificaciones y retorna una lista de todos los ids presentes en los code de las notificaciones
 * @param {Array} notifications 
 */
export function getChatGlobesList(notifications){
    const globesList =[]
    if (notifications){
        let numberId = undefined
        notifications.forEach(element => {
            numberId = Number(element.sender_user.id)
            if (!(globesList.includes(numberId))){
                globesList.push(numberId)
            }
        });
    }
    return globesList
}