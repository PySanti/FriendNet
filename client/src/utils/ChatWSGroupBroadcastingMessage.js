/**
 * Recibe el nombre del grupo y retorna el mensaje que
 * sera enviado a traves del websocket para la creacion del grupo entre los dos 
 */
export function ChatWSGroupBroadcastingMessage(groupName, message){
    return JSON.stringify({
        'type' : 'message_broadcasting',
        'name' : groupName,
        'value' : message
    })
}