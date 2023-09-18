/**
 * Recibe el id del usuario duenio de la sesion y el id del usuario clikeado y retorna el mensaje que
 * sera enviado a traves del websocket para la creacion del grupo entre los dos 
 */
export function MessagesWSGroupCreationMsg(groupName){
    return JSON.stringify({
        'type' : 'group_creation',
        'name' : groupName 
    })
}