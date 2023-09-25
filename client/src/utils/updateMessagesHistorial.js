/**
 * Asigna un nuevo valor a la lista de mensajes dependiendo del contexto actual
 */
export function updateMessagesHistorial(messagesHistorialSetter, pageRef, newMessages, messagesHistorial){
    if (pageRef.current === 1){
        messagesHistorialSetter(newMessages)
    } else {
        messagesHistorial.unshift(...newMessages)
        messagesHistorialSetter(messagesHistorial)
    }
}