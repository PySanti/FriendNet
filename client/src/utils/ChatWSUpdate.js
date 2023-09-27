export function ChatWSUpdate(setMessagesHistorial, messagesHistorial, sessionUserId, clickedUser, setGroupFull, setCurrentUserIsOnline){
    return  (event) => {
        const data = JSON.parse(event.data)
        const dataType = data.type
        console.log('Recibiendo datos a traves del websocket de mensajes')
        console.log(data)
        delete data.type
        if (dataType === "message_broadcast"){
            if (Number(data.parent_id) !== Number(sessionUserId)){
                setMessagesHistorial([...messagesHistorial, data])
            }
        } else if (dataType === "group_info"){
            setGroupFull(data.group === "full" ? true : false)
        } else if (dataType === "connection_inform"){
            if (data['user_id'] == clickedUser.id){
                setCurrentUserIsOnline(data['connected'])
            }
        }
    };
}