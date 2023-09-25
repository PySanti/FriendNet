import {useState, useEffect} from "react"
import { MessagesContainer } from "./MessagesContainer"
import { ChattingUserHeader } from "./ChatingUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {PropTypes} from "prop-types"
import {MESSAGES_WEBSOCKET} from "../utils/constants"
import {MessagesWSGroupBroadcastingMessage} from "../utils/MessagesWSGroupBroadcastingMessage" 
import {MessagesWSGroupCreationMsg}         from "../utils/MessagesWSGroupCreationMsg"
import {MessagesWSGroupName}                from "../utils/MessagesWSGroupName"
import {MessagesWSInitialize} from "../utils/MessagesWSInitialize"

/**
 * 
 * Contenedor unicamente del chat entre el session user y el clicked user
 * @param {Number} sessionUserId id del usuario de la sesion
 * @param {Object} clickedUser info del usuario con el que se esta chateando
 * @param {Object} lastClickedUser
 * @param {Object} loadingStateHandlers
 * @param {Boolean} currentUserIsOnline
 * @param {Array} messagesHistorial
 * @param {Function} setMessagesHistorial
 * @param {Objects} messagesHistorialPage
 * @param {Function} setCurrentUserIsOnline
*/
export function Chat({
        sessionUserId, 
        clickedUser, 
        lastClickedUser, 
        loadingStateHandlers,
        setCurrentUserIsOnline,
        currentUserIsOnline, 
        messagesHistorial, 
        setMessagesHistorial, 
        messagesHistorialPage}){

    let [newMsg, setNewMsg]                                             = useState(null)
    let [newMsgSended, setNewMsgSended]                                 = useState(null)
    let [groupFull, setGroupFull]                                       = useState(false)


    useEffect(()=>{
        if (clickedUser){
            if (!MESSAGES_WEBSOCKET.current){
                MessagesWSInitialize(sessionUserId, clickedUser.id)
            } else {
                MESSAGES_WEBSOCKET.current.send(MessagesWSGroupCreationMsg(MessagesWSGroupName(sessionUserId, clickedUser.id)))
            }
        }
    }, [clickedUser])

    useEffect(()=>{
        if (newMsgSended && MESSAGES_WEBSOCKET.current){
            MESSAGES_WEBSOCKET.current.send(MessagesWSGroupBroadcastingMessage(MessagesWSGroupName(sessionUserId, clickedUser.id), newMsgSended))
            setNewMsgSended(null)
        }
    }, [newMsgSended])
    useEffect(()=>{
        if (MESSAGES_WEBSOCKET.current){
            MESSAGES_WEBSOCKET.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                const dataType = data.type
                console.log('Recibiendo datos a traves del websocket de notificaciones')
                console.log(data)
                delete data.type
                if (dataType === "message_broadcast"){
                    if (Number(data.parent_id) !== Number(sessionUserId)){
                        setMessagesHistorial([...messagesHistorial, data])
                    }
                } else if (dataType === "group_info"){
                    setGroupFull(data.group === "full" ? true : false)
                    console.log(data)
                } else if (dataType === "connection_inform"){
                    if (data['connected_user_id'] == clickedUser.id){
                        setCurrentUserIsOnline(data['connected'])
                    } else {
                        console.error('Error con el connection_inform')
                    }
                }
            };
        }
    }, [messagesHistorial])


    return (
        <div className="chat-container">
            {clickedUser && <ChattingUserHeader chatingUser={clickedUser} isOnline={currentUserIsOnline}/>}
            <MessagesContainer sessionUserId={sessionUserId}  clickedUser={clickedUser} lastClickedUser={lastClickedUser} loadingStateHandlers={loadingStateHandlers} newMsg={newMsg} messagesHistorial={messagesHistorial} setMessagesHistorial={setMessagesHistorial} newMsgSendedSetter={setNewMsgSended} groupFull={groupFull} messagesHistorialPage={messagesHistorialPage}/>
            {clickedUser && <MsgSendingInput onMsgSending={(newMsg)=>setNewMsg(newMsg)}/>}
        </div>
    )
}

Chat.propTypes = {
    sessionUserId : PropTypes.number.isRequired,
    clickedUser : PropTypes.object,
    lastClickedUser : PropTypes.object,
    loadingStateHandlers : PropTypes.object.isRequired,
    currentUserIsOnline : PropTypes.bool.isRequired,
    messagesHistorial : PropTypes.array,
    setMessagesHistorial : PropTypes.func.isRequired,
    messagesHistorialPage : PropTypes.object.isRequired,
    setCurrentUserIsOnline : PropTypes.func.isRequired
}
