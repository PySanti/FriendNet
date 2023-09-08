import { MessagesContainer } from "./MessagesContainer"
import { ChattingUserHeader } from "./ChatingUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {PropTypes} from "prop-types"


/**
 * Contenedor unicamente del chat entre el session user
 * @param {Array} messages lista de mensajes traidos desde la api
 * @param {Number} sessionUserId id del usuario de la sesion
 * @param {Function} onMsgSending funcion que se llamara cuando se envie un mensaje
 * @param {Object} chatingUser info del usuario con el que se esta chateando
 * @param {Function} messagesUpdatingSetter funcion para avisar que se debe actualizar la lista de mensajes
 */
export function Chat({messages, sessionUserId, onMsgSending, chatingUser, messagesUpdatingSetter}){
    return (
        <div className="chat-container">
            {chatingUser && <ChattingUserHeader chatingUser={chatingUser}/>}
            <MessagesContainer messages={messages} sessionUserId={sessionUserId} messagesUpdatingSetter={messagesUpdatingSetter}/>
            {chatingUser && <MsgSendingInput onMsgSending={onMsgSending}/>}
        </div>
    )
}

Chat.propTypes = {
    messages : PropTypes.array,
    sessionUserId : PropTypes.number.isRequired,
    onMsgSending : PropTypes.func.isRequired,
    chatingUser : PropTypes.object,
    messagesUpdatingSetter : PropTypes.func.isRequired,
}
Chat.defaultProps = {
    messages : undefined,
    chatingUser : undefined
}

