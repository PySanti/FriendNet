/**
 * Recibe el id del usuario duenio de la sesion y retorna el mensaje que
 * sera enviado a traves del websocket para la creacion del grupo 
 */
export function NotificationsWSGroupCreationMsg(sessionUserId){
    return JSON.stringify({
        'type' : 'group_creation',
        'name' : sessionUserId 
    })
}