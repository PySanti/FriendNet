import "../styles/Message.css"
import {PropTypes} from "prop-types"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"

/**
 *  Componente creado para mensajes individuales 
 * @param {Object} messageObj objeto del mensaje retornado por la api
 */
export function Message({messageObj}){
    const messageCls = "message"
    return (
        <div className={messageObj.parent_id == getUserDataFromLocalStorage().id ? `${messageCls} session-msg` :  `${messageCls} not-session-msg` }>
            <h3 className="message-content">{messageObj.content}</h3>
        </div>
    )
}

Message.propTypes = {
    messageObj : PropTypes.object.isRequired,
}
