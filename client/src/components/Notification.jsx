import {updateClickedUser} from "../utils/updateClickedUser"
import {useClickedUser} from "../store"
import {useLastClickedUser} from "../store"
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
    
    const handleDeleteClick = (event)=>{
        onNotificationDelete(notification)
        event.stopPropagation()
    }
    const onNotificationClick = async ()=>{
        updateClickedUser(clickedUser, notification.sender_user, setClickedUser, setLastClickedUser)
    }
    return (
        <div className="individual-notification-container" >
            <h4 className="individual-notification-content"onClick={onNotificationClick}>
                {notification.msg}
            </h4>
            <button className="individual-notification-delete-btn" onClick={handleDeleteClick}>
                <span className="material-symbols-outlined">
                delete
                </span>
            </button>
        </div>
    )
}

Notification.propTypes = {
    onNotificationDelete : PropTypes.func.isRequired,
    notification : PropTypes.object.isRequired,
}

