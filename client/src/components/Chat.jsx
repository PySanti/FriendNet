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
 * @param {Func} loadMessagesFunc
*/
export function Chat({
        sessionUserId, 
        clickedUser, 
        lastClickedUser, 
        loadingStateHandlers, 
        currentUserIsOnline, 
        messagesHistorial, 
        setMessagesHistorial, 
        messagesHistorialPage, 
        loadMessagesFunc}){

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
                delete data.type
                if (dataType === "message_broadcast"){
                    if (Number(data.parent_id) !== Number(sessionUserId)){
                        setMessagesHistorial([...messagesHistorial, data])
                    }
                } else if (dataType === "group_info"){
                    setGroupFull(data.group === "full" ? true : false)
                    console.log(data)
                }
            };
        }
    }, [messagesHistorial])


    return (
        <div className="chat-container">
            {clickedUser && <ChattingUserHeader chatingUser={clickedUser} isOnline={currentUserIsOnline}/>}
            <MessagesContainer sessionUserId={sessionUserId}  clickedUser={clickedUser} lastClickedUser={lastClickedUser} loadingStateHandlers={loadingStateHandlers} newMsg={newMsg} messagesHistorial={messagesHistorial} setMessagesHistorial={setMessagesHistorial} newMsgSendedSetter={setNewMsgSended} groupFull={groupFull} messagesHistorialPage={messagesHistorialPage} loadMessagesFunc={loadMessagesFunc}/>
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
    loadMessagesFunc : PropTypes.func.isRequired
}
