import { FormatedMessages } from "./FormatedMessages"
import { ChattingUserHeader } from "./ChatingUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"


/**
 * Contenedor unicamente del chat entre el session user
 * @param {Array} messages lista de mensajes traidos desde la api
 * @param {Number} session_user_id id del usuario de la sesion
 * @param {Function} onMsgSending funcion que se llamara cuando se envie un mensaje
 * @param {Object} chatingUser info del usuario con el que se esta chateando
 */
export function Chat({messages, session_user_id, onMsgSending, chatingUser}){
    if (!chatingUser){
        return (
            <div className="chat-container">
                Selecciona a un usuario
            </div>
        )
    }
    return (
        <div className="chat-container">
            {chatingUser && <ChattingUserHeader chatingUser={chatingUser}/>}
            {!messages && <h3>{"no hay mensajes"}</h3>}
            {messages && <FormatedMessages messages={messages} session_user_id={session_user_id}/>}
            <MsgSendingInput onMsgSending={onMsgSending}/>
        </div>
    )
}