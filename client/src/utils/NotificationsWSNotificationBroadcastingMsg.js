/**
 * Recibe el id de la nueva notificacion y el id del receiver user y retorna el mensaje a enviar
 * al websocket para broadcasting
 */
export function NotificationsWSNotificationBroadcastingMsg(notificationId, receiverUserId){
    return JSON.stringify({
        'type' : 'notification_broadcasting',
        'notification_id' : notificationId,
        'receiver_user_id' : receiverUserId
    })
}
