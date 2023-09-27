export function NotificationsWSConnectionInformMessage(userId, connected){
    return JSON.stringify(
        {
            "type" : "connection_inform",
            "user_id" : userId,
            'connected' : connected
        }
    )
}