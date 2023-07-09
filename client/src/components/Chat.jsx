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
    return (
        <div className="chat-container">
            <ChattingUserHeader chatingUser={chatingUser}/>
            <FormatedMessages messages={messages} session_user_id={session_user_id}/>
            {chatingUser && <MsgSendingInput onMsgSending={onMsgSending}/>}
        </div>
    )
}