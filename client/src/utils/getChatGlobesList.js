/**
 * Recibe la lista de notificaciones y retorna una lista de todos los ids presentes en los code de las notificaciones
 * @param {Array} notifications 
 */
export function getChatGlobesList(notifications){
    const globesList =[]
    notifications.forEach(element => {
        if (!(globesList.includes(Number(element.sender_user.id)))){
            globesList.push(Number(element.sender_user.id))
        }
    });
    return globesList
}