import {PropTypes} from "prop-types"
import "../styles/Notifications.css"
import { useEffect, useState } from "react"
import { v4 } from "uuid"
/**
 * Componente creado para contener las notificaciones del usuarios
 * @param {Array} notificationList lista de notificaciones
 * @param {Function} onNotificationClick funcion que se ejecutara cuando se clickee una notificacion
 */
export function Notifications({notificationList, onNotificationClick}){
    let [notificacionsActivated, setNotificationsActivated] = useState(false)
    const notificationListCls = "notification-list"
    const formatingFunction =(notification)=>{
        return <div key={v4()} className="notification"onClick={()=>onNotificationClick(notification.code, notification.id)} >{notification.msg}</div>
    }
    useEffect(()=>{
        console.log(notificacionsActivated)
    }, [notificacionsActivated])
    return (
        <div className="notifications-container">
            <button className="notifications-bell" onClick={()=>{setNotificationsActivated(notificacionsActivated ? false : true)}}></button>
            <div className={notificacionsActivated ? `${notificationListCls} ${notificationListCls}-active` : notificationListCls}>
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