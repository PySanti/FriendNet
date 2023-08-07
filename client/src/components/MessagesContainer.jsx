
import {PropTypes} from "prop-types"
import { Message } from "./Message"
import "../styles/MessagesContainer.css"
import { v4 } from "uuid"


/**
 * Recibe la lista de mensajes y retorna un contenedor HTML renderizable
 * @param {Array} messages lista de mensajes
 * @param {Number} sessionUserId  id de usuario de sesion
 */
export function MessagesContainer({messages, sessionUserId }){
    const formatingFunction = (msg)=>{
        return <Message key={v4()} content={msg.content} sessionUserMsg={sessionUserId === msg.parent_id}/>
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
    sessionUserId : PropTypes.number.isRequired 
}
MessagesContainer.defaultProps = {
    messages : undefined
}