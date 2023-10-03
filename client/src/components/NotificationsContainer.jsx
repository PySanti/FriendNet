import {PropTypes} from "prop-types"
import "../styles/NotificationsContainer.css"
import {  useState } from "react"
import { v4 } from "uuid"
import { Notification } from "./Notification"
import {useEffect} from "react"
import {useNotifications} from "../store/notificationsStore"
import {useChatGlobeList} from "../store/chatGlobeListStore"
import {getChatGlobesList} from "../utils/getChatGlobesList"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {NotificationsWSUpdate} from "../utils/NotifcationsWSUpdate"
import {NotificationsWSInitialize} from "../utils/NotificationsWSInitialize"
import {useNavigate} from "react-router-dom"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeSecuredApi} from "../utils/executeSecuredApi"
import {notificationDeleteAPI} from "../api/notificationDelete.api"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_UNEXPECTED_ERROR_MESSAGE, BASE_UNEXPECTED_ERROR_LOG} from "../utils/constants"
import {useLoadingState} from "../store/loadingStateStore"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
/**
 * Componente creado para contener las notificaciones del usuarios
 * @param {Function} onNotificationClick funcion que se ejecutara cuando se clickee una notificacion
 */
export function NotificationsContainer({onNotificationClick}){
    let [notificacionsActivated, setNotificationsActivated] = useState(false)
    let [setChatGlobeList] = useChatGlobeList((state)=>([state.setChatGlobeList]))
    let [notifications, setNotifications] = useNotifications((state)=>(state.notifications, state.setNotifications))
    const userData = getUserDataFromLocalStorage()
    const notificationListCls = "notification-list"
    const navigate = useNavigate()
    const setLoadingState = useLoadingState((state)=>(state.setLoadingState))

    const onNotificationDelete = async (notification)=>{
        const response = await executeSecuredApi(async ()=>{
            return await notificationDeleteAPI(notification.id, getJWTFromLocalStorage().access )
        }, navigate)
        if (response){
            if (response.status == 200){
                removeAndUpdateNotifications(notification, setNotifications)
            } else if (response.status == 400){
                console.log('Error inesperado eliminando notificacion')
            } else if (response == BASE_FALLEN_SERVER_ERROR_MSG || response == BASE_UNEXPECTED_ERROR_MESSAGE){
                setLoadingState({
                    BASE_FALLEN_SERVER_ERROR_MSG : BASE_FALLEN_SERVER_LOG,
                    BASE_UNEXPECTED_ERROR_MESSAGE : BASE_UNEXPECTED_ERROR_LOG
                }[response])
            }
        }
    }

    const formatingFunction =(notification)=>{
        return <Notification key={v4()} onNotificationClick={onNotificationClick} notification={notification} onNotificationDelete={onNotificationDelete}/>
    }
    useEffect(()=>{
        setChatGlobeList(getChatGlobesList(notifications))
        if (!NOTIFICATIONS_WEBSOCKET.current && userData){
            NotificationsWSUpdate(userData.id, notifications,setNotifications )
        }
    }, [notifications])
    useEffect(()=>{
        if (!NOTIFICATIONS_WEBSOCKET.current && userData){
            NotificationsWSInitialize(userData.id)
            NotificationsWSUpdate(userData.id, notifications,setNotifications, navigate)
        }
    }, [])
    return (
        <div className="notifications-container">
            <button className="notifications-bell" onClick={()=>{setNotificationsActivated(notificacionsActivated ? false : true)}}></button>
            <div className={notificacionsActivated ? `${notificationListCls} ${notificationListCls}-active` : notificationListCls}>
                {(notifications && notifications.length > 0) ?
                    notifications.map(formatingFunction)
                    :
                    <h5 className="no-notifications">No tienes notificaciones</h5>
                }
            </div>
        </div>
    )
}

NotificationsContainer.propTypes = {
    onNotificationClick : PropTypes.func.isRequired,
    onNotificationDelete : PropTypes.func.isRequired,
}

