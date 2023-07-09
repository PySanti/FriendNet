/**
 * Componente creado para contener las notificaciones del usuarios
 * @param {Array} notificationList lista de notificaciones
 * @param {Function} onNotificationClick funcion que se ejecutara cuando se clickee una notificacion
 */
export function Notifications({notificationList, onNotificationClick}){
    let compList = undefined
    if (notificationList){
        compList = notificationList.map((notification)=>{
            return <button onClick={()=>onNotificationClick(notification.code, notification.id)} key={notification.code}>{notification.msg}</button>
        })
    }
    return (
        <div className="notifications-container">
            <h2>Notificaciones</h2>
            {notificationList && <div className="notification-list">{compList}</div>}
            {!notificationList && <div className="notification-list"><h5>No tienes notificaciones</h5></div>}
        </div>
    )
}