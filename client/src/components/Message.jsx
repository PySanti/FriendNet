/**
 *  Componente creado para mensajes individuales 
 * @param {String} content contenido del mensaje
 * @param {Boolean} session_user_msg sera true en caso de que sea un mensaje enviado por el dueño de la sesión
 */
import "../styles/Message.css"
import {PropTypes} from "prop-types"
export function Message({content, session_user_msg}){
    const messageCls = "message"
    return (
        <div className={session_user_msg ? `${messageCls} session-msg` :  `${messageCls} not-session-msg` }>
            <h3 className="message-content">{content}</h3>
        </div>
    )
}

Message.propTypes = {
    content : PropTypes.string.isRequired,
    session_user_msg : PropTypes.bool.isRequired,
}
