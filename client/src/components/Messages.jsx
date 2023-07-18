/**
 * Recibe la lista de mensajes y retorna un contenedor HTML renderizable
 * @param {Array} messages lista de mensajes
 * @param {Number} session_user_id  id de usuario de sesion
 */
import {PropTypes} from "prop-types"
import "../styles/Messages.css"

export function Messages({messages, session_user_id }){
    const formatingFunction = (msg)=>{
        const margin = session_user_id === msg.parent_id? "flex-end" : "flex-start"
        return <div style={{"alignSelf" : margin}} key={msg.id}>{msg.content}</div>
    }
    return (
        <div className="messages-container">
            {messages ?  messages.map(formatingFunction): <h3 className="messages-container__title">Selecciona un usuario</h3>}
        </div>
    )
}

Messages.propTypes = {
    messages : PropTypes.array,
    session_user_id : PropTypes.number 
}
Messages.defaultProps = {
    messages : undefined
}