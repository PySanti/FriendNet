import {PropTypes} from "prop-types"
import "../styles/NotificationsContainer.css"
import {  useState } from "react"
import { v4 } from "uuid"
import { Notification } from "./Notification"
import {useEffect} from "react"
import {useChatGlobeList} from "../store/chatGlobeListStore"
import {getChatGlobesList} from "../utils/getChatGlobesList"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {NotificationsWSInitialize} from "../utils/NotificationsWSInitialize"
import {useNavigate} from "react-router-dom"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeApi} from "../utils/executeApi"
import {notificationDeleteAPI} from "../api/notificationDelete.api"
import {useLoadingState} from "../store/loadingStateStore"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import {getNotificationsFromLocalStorage} from "../utils/getNotificationsFromLocalStorage"
import {handleStandardApiErrors} from "../utils/handleStandardApiErrors"
import {useNotifications} from "../store/notificationsStore"

/**
 * Componente creado para contener las notificaciones del usuarios
 */
export function NotificationsContainer(){
    let [notificacionsActivated, setNotificationsActivated] = useState(false)
    let [setChatGlobeList] = useChatGlobeList((state)=>([state.setChatGlobeList]))
    let [notifications, setNotifications] = useNotifications((state)=>([state.notifications, state.setNotifications]))
    const userData = getUserDataFromLocalStorage()
    const notificationListCls = "notification-list"
    const navigate = useNavigate()
    const [setLoadingState, successfullyLoaded] = useLoadingState((state)=>([state.setLoadingState, state.successfullyLoaded]))

    const onNotificationDelete = async (notification)=>{
        const response = await executeApi(async ()=>{
            return await notificationDeleteAPI(notification.id, getJWTFromLocalStorage().access )
        }, navigate)
        if (response){
            if (response.status == 200){
                removeAndUpdateNotifications(notification, setNotifications)
                successfullyLoaded()
            } else if (response.status == 400){
                console.log('Error inesperado eliminando notificacion')
            } else {
                if (!handleStandardApiErrors(response, setLoadingState)){
                    setLoadingState('Ha ocurrido un error eliminando la notificación !')
                }
            }
        }
    }

    const formatingFunction =(notification)=>{
        return <Notification key={v4()} notification={notification} onNotificationDelete={onNotificationDelete}/>
    }
    useEffect(()=>{
        setChatGlobeList(getChatGlobesList(notifications))
    }, [notifications])

    useEffect(()=>{
        const localStorageNotifications = getNotificationsFromLocalStorage()
        if (notifications.length == 0 && localStorageNotifications){
            setNotifications(localStorageNotifications)
        }
        if (!NOTIFICATIONS_WEBSOCKET.current && userData){
            NotificationsWSInitialize(userData.id)
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

