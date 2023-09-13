import {useState, useEffect, useRef} from "react"
import { MessagesContainer } from "./MessagesContainer"
import { ChattingUserHeader } from "./ChatingUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {PropTypes} from "prop-types"
import {MAIN_WEBSOCKET} from "../utils/constants"
import {wsGroupCreationMsg} from "../utils/wsGroupCreationMsg"
import {MESSAGES_WEBSOCKET_ENDPOINT} from "../utils/constants"
/**
 * Contenedor unicamente del chat entre el session user y el clicked user
 * @param {Number} sessionUserId id del usuario de la sesion
 * @param {Object} clickedUser info del usuario con el que se esta chateando
 * @param {Object} lastClickedUser
 * @param {Object} loadingStateHandlers
 */
export function Chat({sessionUserId, clickedUser, lastClickedUser, loadingStateHandlers}){
    let [newMsg, setNewMsg] = useState(null)
    useEffect(()=>{
        if (clickedUser && clickedUser.is_online){
            if (!MAIN_WEBSOCKET.current){
                console.log('Entrando a un chat por primera vez')
                MAIN_WEBSOCKET.current = new WebSocket(MESSAGES_WEBSOCKET_ENDPOINT);
                MAIN_WEBSOCKET.current.onopen = () => {
                    console.log('Conexión establecida');
                    MAIN_WEBSOCKET.current.send(wsGroupCreationMsg(sessionUserId, clickedUser.id))
                };
                MAIN_WEBSOCKET.current.onmessage = (event) => {
                    console.log('Mensaje recibido:', event.data);
                };
                MAIN_WEBSOCKET.current.onclose = () => {
                    console.log('Conexión cerrada');
                };
            } else {
                MAIN_WEBSOCKET.current.send(wsGroupCreationMsg(sessionUserId, clickedUser.id))
            }
        }
    }, [clickedUser])


    return (
        <div className="chat-container">
            {clickedUser && <ChattingUserHeader chatingUser={clickedUser}/>}
            <MessagesContainer sessionUserId={sessionUserId}  clickedUser={clickedUser} lastClickedUser={lastClickedUser} loadingStateHandlers={loadingStateHandlers} newMsg={newMsg}/>
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
