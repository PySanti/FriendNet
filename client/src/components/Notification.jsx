import {updateClickedUser} from "../utils/updateClickedUser"
import {useClickedUser} from "../store/clickedUserStore"
import {useLastClickedUser} from "../store/lastClickedUserStore"
import {PropTypes} from "prop-types"
import "../styles/Notification.css"


/**
 * Componente creado para modularizar Notification de NotificationsContainer
 * @param {Function} onNotificationDelete funcion que se ejecutara cuando se elimine una notificacion
 * @param {Object} notification
 */
export function Notification({notification, onNotificationDelete}){
    let [clickedUser, setClickedUser] = useClickedUser((state)=>[state.clickedUser, state.setClickedUser])
    let setLastClickedUser = useLastClickedUser((state)=>state.setLastClickedUser)
    
    const onNotificationClick = async ()=>{
        updateClickedUser(clickedUser, notification.sender_user, setClickedUser, setLastClickedUser)
    }
    return (
        <div className="individual-notification-container" >
            <h4 className="individual-notification-content"onClick={onNotificationClick}>
                {notification.msg}
            </h4>
            <button className="individual-notification-delete-btn" onClick={()=>onNotificationDelete(notification)}>x</button>
        </div>
    )
}

Notification.propTypes = {
    onNotificationDelete : PropTypes.func.isRequired,
    notification : PropTypes.object.isRequired,
}

