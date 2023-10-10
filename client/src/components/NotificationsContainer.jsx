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
import {useLoadingState} from "../store/loadingStateStore"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import {getNotificationsFromLocalStorage} from "../utils/getNotificationsFromLocalStorage"
import {handleStandardApiErrors} from "../utils/handleStandardApiErrors"
/**
 * Componente creado para contener las notificaciones del usuarios
 * @param {Function} onNotificationClick funcion que se ejecutara cuando se clickee una notificacion
 */
export function NotificationsContainer({onNotificationClick}){
    let [notificacionsActivated, setNotificationsActivated] = useState(false)
    let [setChatGlobeList] = useChatGlobeList((state)=>([state.setChatGlobeList]))
    let [notifications, setNotifications] = useNotifications((state)=>([state.notifications, state.setNotifications]))
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
            } else {
                handleStandardApiErrors(response, setLoadingState, "Ha habido un fallo eliminando la notificación !")
            }
        }
    }

    const formatingFunction =(notification)=>{
        return <Notification key={v4()} onNotificationClick={onNotificationClick} notification={notification} onNotificationDelete={onNotificationDelete}/>
    }
    useEffect(()=>{
        setChatGlobeList(getChatGlobesList(notifications))
        if (NOTIFICATIONS_WEBSOCKET.current && userData){
            NotificationsWSUpdate(userData.id, notifications,setNotifications, navigate )
        }
    }, [notifications])
    useEffect(()=>{
        const localStorageNotifications = getNotificationsFromLocalStorage()
        if (notifications.length == 0 && localStorageNotifications){
            setNotifications(localStorageNotifications)
        }
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
}

