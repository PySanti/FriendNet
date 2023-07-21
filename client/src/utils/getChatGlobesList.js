/**
 * Recibe la lista de notificaciones y retorna una lista de todos los ids presentes en los code de las notificaciones
 * @param {Array} notifications 
 */
export function getChatGlobesList(notifications){
    const globesList =[]
    notifications.forEach(element => {
        if (element.code !== "u" && !(globesList.includes(Number(element.code)))){
            globesList.push(Number(element.code))
        }
    });
    return globesList
}