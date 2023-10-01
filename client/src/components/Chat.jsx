import {useState, useEffect} from "react"
import { MessagesContainer } from "./MessagesContainer"
import { ChattingUserHeader } from "./ChatingUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {PropTypes} from "prop-types"
import {CHAT_WEBSOCKET} from "../utils/constants"
import {ChatWSGroupCreationMsg}         from "../utils/ChatWSGroupCreationMsg"
import {ChatWSGroupName}                from "../utils/ChatWSGroupName"
import {ChatWSInitialize}               from "../utils/ChatWSInitialize"
import {useClickedUser}                 from "../store/clickedUserStore"
/**
 * 
 * Contenedor unicamente del chat entre el session user y el clicked user
 * @param {Number} sessionUserId id del usuario de la sesion
 * @param {Object} loadingStateHandlers
 * @param {Boolean} currentUserIsOnline
 * @param {Array} messagesHistorial
 * @param {Function} setMessagesHistorial
 * @param {Objects} messagesHistorialPage
 * @param {Function} setCurrentUserIsOnline
 * @param {Object} noMoreMessages
*/
export function Chat({
        sessionUserId, 
        loadingStateHandlers,
        setCurrentUserIsOnline,
        currentUserIsOnline, 
        messagesHistorial, 
        setMessagesHistorial, 
        messagesHistorialPage,
        noMoreMessages
    }){

    let [newMsg, setNewMsg]                                             = useState(null)
    let clickedUser                                                   = useClickedUser((state)=>(state.clickedUser))

    useEffect(()=>{
        if (clickedUser){
            if (!CHAT_WEBSOCKET.current){
                ChatWSInitialize(sessionUserId, clickedUser.id)
            } else {
                CHAT_WEBSOCKET.current.send(ChatWSGroupCreationMsg(ChatWSGroupName(sessionUserId, clickedUser.id)))
            }
        }
    }, [clickedUser])


    useEffect(()=>{
        if (CHAT_WEBSOCKET.current){
            CHAT_WEBSOCKET.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                const dataType = data.type
                console.log('Recibiendo datos a traves del websocket de mensajes')
                console.log(data)
                delete data.type
                if (dataType === "message_broadcast"){
                    if (Number(data.parent_id) !== Number(sessionUserId)){
                        setMessagesHistorial([...messagesHistorial, data])
                    }
                } else if (dataType === "connection_inform"){
                    if (data['user_id'] == clickedUser.id){
                        setCurrentUserIsOnline(data['connected'])
                    }
                }
            };
        }
    }, [messagesHistorial])


    return (
        <div className="chat-container">
            {clickedUser.username  && <ChattingUserHeader isOnline={currentUserIsOnline}/>}
            <MessagesContainer sessionUserId={sessionUserId} loadingStateHandlers={loadingStateHandlers} newMsg={newMsg} messagesHistorial={messagesHistorial} setMessagesHistorial={setMessagesHistorial} messagesHistorialPage={messagesHistorialPage} noMoreMessages={noMoreMessages}/>
            {clickedUser.username && <MsgSendingInput onMsgSending={(newMsg)=>setNewMsg(newMsg)}/>}
        </div>
    )
}

Chat.propTypes = {
    sessionUserId : PropTypes.number.isRequired,
    loadingStateHandlers : PropTypes.object.isRequired,
    currentUserIsOnline : PropTypes.bool.isRequired,
    messagesHistorial : PropTypes.array,
    setMessagesHistorial : PropTypes.func.isRequired,
    messagesHistorialPage : PropTypes.object.isRequired,
    setCurrentUserIsOnline : PropTypes.func.isRequired,
    noMoreMessages : PropTypes.object.isRequired
}
