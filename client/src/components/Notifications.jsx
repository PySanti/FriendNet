import {PropTypes} from "prop-types"
import "../styles/Notifications.css"
/**
 * Componente creado para contener las notificaciones del usuarios
 * @param {Array} notificationList lista de notificaciones
 * @param {Function} onNotificationClick funcion que se ejecutara cuando se clickee una notificacion
 */
export function Notifications({notificationList, onNotificationClick}){
    const formatingFunction =(notification)=>{
        return <div className="notification"onClick={()=>onNotificationClick(notification.code, notification.id)} key={notification.code}>{notification.msg}</div>
    }
    const activateNotifications = ()=>{

    }
    return (
        <div className="notifications-container">
            <button className="notifications-bell" onClick={activateNotifications}></button>
            <div className="notification-list">
                {notificationList ?
                    notificationList.map(formatingFunction)
                    :
                    <h5 className="no-notifications">No tienes notificaciones</h5>
                }
            </div>
        </div>
    )
}

Notifications.propTypes = {
    notificationList : PropTypes.array,
    onNotificationClick : PropTypes.func.isRequired,
}

Notifications.defaultProps = {
    notificationList : undefined,
}