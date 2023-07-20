/**
 * Componente creado para modularizar Notification de NotificationsContainer
 * @param {Function} onNotificationClick funcion que se ejecutara cuando se clickee la notificacion 
 * @param {Function} onNotificationDelete funcion que se ejecutara cuando se elimine una notificacion
 * @param {Object} notification
 */
import {PropTypes} from "prop-types"
import "../styles/Notification.css"

export function Notification({onNotificationClick, notification, onNotificationDelete}){
    return (
        <div className="individual-notification-container" >
            <h4 className="individual-notification-content"onClick={()=>onNotificationClick(notification)}>
                {notification.msg}
            </h4>
            <button className="individual-notification-delete-btn" onClick={()=>onNotificationDelete(notification)}>x</button>
        </div>
    )
}

Notification.propTypes = {
    onNotificationClick : PropTypes.func.isRequired,
    onNotificationDelete : PropTypes.func.isRequired,
    notification : PropTypes.object.isRequired,
}

