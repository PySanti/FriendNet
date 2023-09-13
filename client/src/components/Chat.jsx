import {useState, useEffect, useRef} from "react"
import { MessagesContainer } from "./MessagesContainer"
import { ChattingUserHeader } from "./ChatingUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {PropTypes} from "prop-types"
/**
 * Contenedor unicamente del chat entre el session user y el clicked user
 * @param {Number} sessionUserId id del usuario de la sesion
 * @param {Object} clickedUser info del usuario con el que se esta chateando
 * @param {Object} lastClickedUser
 * @param {Object} loadingStateHandlers
 */
export function Chat({sessionUserId, clickedUser, lastClickedUser, loadingStateHandlers}){
    let [newMsg, setNewMsg] = useState(null)
    let socket = useRef(null)
    useEffect(()=>{
        socket.current = new WebSocket(`ws://localhost:8000/ws/my_consumer/`);
        socket.current.onopen = () => {
            console.log('Conexión establecida');
        };
        socket.current.onmessage = (event) => {
            console.log('Mensaje recibido:', event.data);
        };
        socket.current.onclose = () => {
            console.log('Conexión cerrada');
        };
    }, [])
    useEffect(()=>{
        if (newMsg){
            console.log(newMsg)
            socket.current.send(newMsg.msg)
        }
    }, [newMsg])
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
