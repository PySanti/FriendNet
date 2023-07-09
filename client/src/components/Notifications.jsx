/**
 * Componente creado para contener las notificaciones del usuarios
 * @param {Array} notificationList lista de notificaciones
 * @param {Function} onNotificationClick funcion que se ejecutara cuando se clickee una notificacion
 */
export function Notifications({notificationList, onNotificationClick}){
    const compList = notificationList.map((notification)=>{
        return <button onClick={()=>onNotificationClick(notification.code)} key={notification.code}>{notification.msg}</button>
    })
    return (
        <div className="notifications-container">
            <h2>Notificaciones</h2>
            <div className="notification-list">{compList}</div>
        </div>
    )
}