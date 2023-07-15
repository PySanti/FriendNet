/**
 * Componente creado para contener las notificaciones del usuarios
 * @param {Array} notificationList lista de notificaciones
 * @param {Function} onNotificationClick funcion que se ejecutara cuando se clickee una notificacion
 */
export function Notifications({notificationList, onNotificationClick}){
    const formatingFunction =(notification)=>{
        return <button className="notification"onClick={()=>onNotificationClick(notification.code, notification.id)} key={notification.code}>{notification.msg}</button>
    }
    return (
        <div className="notifications-container">
            <h2 className="notifications-title">Notificaciones</h2>
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