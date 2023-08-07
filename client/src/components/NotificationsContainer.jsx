import {PropTypes} from "prop-types"
import "../styles/NotificationsContainer.css"
import {  useState } from "react"
import { v4 } from "uuid"
import { Notification } from "./Notification"

/**
 * Componente creado para contener las notificaciones del usuarios
 * @param {Array} notificationList lista de notificaciones
 * @param {Function} onNotificationClick funcion que se ejecutara cuando se clickee una notificacion
 * @param {Function} onNotificationDelete funcion que se ejecutara cuando se eliminen funciones
 */
export function NotificationsContainer({notificationList, onNotificationClick, onNotificationDelete}){
    let [notificacionsActivated, setNotificationsActivated] = useState(false)
    const notificationListCls = "notification-list"
    const formatingFunction =(notification)=>{
        return <Notification key={v4()} onNotificationClick={onNotificationClick} notification={notification} onNotificationDelete={onNotificationDelete}/>
    }
    return (
        <div className="notifications-container">
            <button className="notifications-bell" onClick={()=>{setNotificationsActivated(notificacionsActivated ? false : true)}}></button>
            <div className={notificacionsActivated ? `${notificationListCls} ${notificationListCls}-active` : notificationListCls}>
                {(notificationList && notificationList.length > 0) ?
                    notificationList.map(formatingFunction)
                    :
                    <h5 className="no-notifications">No tienes notificaciones</h5>
                }
            </div>
        </div>
    )
}

NotificationsContainer.propTypes = {
    notificationList : PropTypes.array,
    onNotificationClick : PropTypes.func.isRequired,
    onNotificationDelete : PropTypes.func.isRequired,
}

NotificationsContainer.defaultProps = {
    notificationList : undefined,
}