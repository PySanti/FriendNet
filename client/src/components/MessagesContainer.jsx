/**
 * Recibe la lista de mensajes y retorna un contenedor HTML renderizable
 * @param {Array} messages lista de mensajes
 * @param {Number} session_user_id  id de usuario de sesion
 */
import {PropTypes} from "prop-types"
import { Message } from "./Message"
import "../styles/MessagesContainer.css"
import { v4 } from "uuid"


export function MessagesContainer({messages, session_user_id }){
    const formatingFunction = (msg)=>{
        return <Message key={v4()} content={msg.content} session_user_msg={session_user_id === msg.parent_id}/>
    }
    return (
        <div className="messages-container">
            {messages ?  
                messages.map(formatingFunction)
                : 
                <h3 className="messages-container__title">No hay mensajes :(</h3>
            }
        </div>
    )
}

MessagesContainer.propTypes = {
    messages : PropTypes.array,
    session_user_id : PropTypes.number 
}
MessagesContainer.defaultProps = {
    messages : undefined
}