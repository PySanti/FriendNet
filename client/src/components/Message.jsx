/**
 *  Componente creado para mensajes individuales 
 * @param {String} content contenido del mensaje
 * @param {Boolean} sessionUserMsg sera true en caso de que sea un mensaje enviado por el dueño de la sesión
 */
import "../styles/Message.css"
import {PropTypes} from "prop-types"
export function Message({content, sessionUserMsg}){
    const messageCls = "message"
    return (
        <div className={sessionUserMsg ? `${messageCls} session-msg` :  `${messageCls} not-session-msg` }>
            <h3 className="message-content">{content}</h3>
        </div>
    )
}

Message.propTypes = {
    content : PropTypes.string.isRequired,
    sessionUserMsg : PropTypes.bool.isRequired,
}
