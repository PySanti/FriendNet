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
import {getUserDataFromLocalStorage}    from "../utils/getUserDataFromLocalStorage"
import {useMessagesHistorial} from "../store/messagesHistorialStore"
/**
 * 
 * Contenedor unicamente del chat entre el session user y el clicked usee\
 * @param {Objects} messagesHistorialPage
 * @param {Object} noMoreMessages
*/
export function Chat({
        messagesHistorialPage,
        noMoreMessages
    }){

    let [newMsg, setNewMsg]                                             = useState(null)
    let [clickedUser, setClickedUser]                                                   = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let [messagesHistorial, setMessagesHistorial]                           = useMessagesHistorial((state)=>([state.messagesHistorial, state.setMessagesHistorial]))

    const userData = getUserDataFromLocalStorage()
    
    
    useEffect(()=>{
        if (clickedUser){
            if (!CHAT_WEBSOCKET.current){
                ChatWSInitialize(userData.id, clickedUser.id)
            } else {
                CHAT_WEBSOCKET.current.send(ChatWSGroupCreationMsg(ChatWSGroupName(userData.id, clickedUser.id)))
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
                    if (Number(data.parent_id) !== Number(userData.id)){
                        setMessagesHistorial([...messagesHistorial, data])
                    }
                } else if (dataType === "connection_inform"){
                    if (data['user_id'] == clickedUser.id){
                        clickedUser.is_online = data['connected']
                        setClickedUser(clickedUser)
                    }
                }
            };
        }
    }, [messagesHistorial])


    return (
        <div className="chat-container">
            {clickedUser.username  && <ChattingUserHeader/>}
            <MessagesContainer newMsg={newMsg}  messagesHistorialPage={messagesHistorialPage} noMoreMessages={noMoreMessages}/>
            {clickedUser.username && <MsgSendingInput onMsgSending={(newMsg)=>setNewMsg(newMsg)}/>}
        </div>
    )
}

Chat.propTypes = {
    messagesHistorialPage : PropTypes.object.isRequired,
    noMoreMessages : PropTypes.object.isRequired
}
