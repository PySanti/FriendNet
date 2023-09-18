import {useState, useEffect} from "react"
import { MessagesContainer } from "./MessagesContainer"
import { ChattingUserHeader } from "./ChatingUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {PropTypes} from "prop-types"
import {MAIN_WEBSOCKET} from "../utils/constants"
import {wsGroupCreationMsg} from "../utils/wsGroupCreationMsg"
import {wsGroupName} from "../utils/wsGroupName"
import {MESSAGES_WEBSOCKET_ENDPOINT} from "../utils/constants"
import {wsGroupBroadcastingMessage} from "../utils/wsGroupBroadcastingMessage" 
/**
 * Contenedor unicamente del chat entre el session user y el clicked user
 * @param {Number} sessionUserId id del usuario de la sesion
 * @param {Object} clickedUser info del usuario con el que se esta chateando
 * @param {Object} lastClickedUser
 * @param {Object} loadingStateHandlers
 */
export function Chat({sessionUserId, clickedUser, lastClickedUser, loadingStateHandlers}){
    let [newMsg, setNewMsg]                                             = useState(null)
    let [messagesHistorial, setMessagesHistorial]                       = useState([])
    let [newMsgSended, setNewMsgSended]                                 = useState(null)
    useEffect(()=>{
        if (clickedUser){
            if (!MAIN_WEBSOCKET.current){
                console.log('Entrando a un chat por primera vez')
                MAIN_WEBSOCKET.current = new WebSocket(MESSAGES_WEBSOCKET_ENDPOINT);
                MAIN_WEBSOCKET.current.onopen = () => {
                    console.log('Conexión establecida');
                    MAIN_WEBSOCKET.current.send(wsGroupCreationMsg(wsGroupName(sessionUserId, clickedUser.id)))
                };
                MAIN_WEBSOCKET.current.onclose = () => {
                    console.log('Conexión cerrada');
                };
            } else {
                MAIN_WEBSOCKET.current.send(wsGroupCreationMsg(wsGroupName(sessionUserId, clickedUser.id)))
            }
        }
    }, [clickedUser])
    useEffect(()=>{
        if (newMsgSended && MAIN_WEBSOCKET.current){
            MAIN_WEBSOCKET.current.send(
                wsGroupBroadcastingMessage(
                    wsGroupName(sessionUserId, clickedUser.id), newMsgSended)
                )
            setNewMsgSended(null)
        }
    }, [newMsgSended])
    useEffect(()=>{
        console.log('Actualizando broadcast handler')
        if (MAIN_WEBSOCKET.current){
            MAIN_WEBSOCKET.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                console.log('Broadcast recibido exitosamente ', data)
                if (Number(data.parent_id) !== Number(sessionUserId)){
                    setMessagesHistorial([...messagesHistorial, data])
                }
            };
        }
    }, [messagesHistorial])


    return (
        <div className="chat-container">
            {clickedUser && <ChattingUserHeader chatingUser={clickedUser}/>}
            <MessagesContainer sessionUserId={sessionUserId}  clickedUser={clickedUser} lastClickedUser={lastClickedUser} loadingStateHandlers={loadingStateHandlers} newMsg={newMsg} messagesHistorial={messagesHistorial} setMessagesHistorial={setMessagesHistorial} newMsgSendedSetter={setNewMsgSended}/>
            {clickedUser && <MsgSendingInput onMsgSending={(newMsg)=>setNewMsg(newMsg)}/>}
        </div>
    )
}

Chat.propTypes = {
    sessionUserId : PropTypes.number.isRequired,
    clickedUser : PropTypes.object,
    lastClickedUser : PropTypes.object,
    loadingStateHandlers : PropTypes.object.isRequired,
}
