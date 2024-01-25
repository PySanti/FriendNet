import {Button} from "../components/Button"
import {toast} from "sonner"
import "../styles/NotificationsContainer.css"
import {  useState } from "react"
import { v4 } from "uuid"
import { Notification } from "./Notification"
import {useEffect} from "react"
import {useChatGlobeList} from "../store"
import {getChatGlobesList} from "../utils/getChatGlobesList"
import {useNavigate} from "react-router-dom"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeApi} from "../utils/executeApi"
import {notificationDeleteAPI} from "../api/notificationDelete.api"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import {useNotifications} from "../store"
import {initStates} from "../utils/initStates"
/**
 * Componente creado para contener las notificaciones del usuarios
 */
export function NotificationsContainer(){
    let [notificacionsActivated, setNotificationsActivated] = useState(false)
    let [setChatGlobeList]                                  = useChatGlobeList((state)=>([state.setChatGlobeList]))
    let [notifications, setNotifications]                   = useNotifications((state)=>([state.notifications, state.setNotifications]))
    const notificationListCls                               = "notification-list"
    const navigate                                          = useNavigate()
    const handleNotificationsBellClick = ()=>{
        setNotificationsActivated(!notificacionsActivated)
    }
    const onNotificationDelete = async (notification)=>{
        const response = await executeApi(async ()=>{
            return await notificationDeleteAPI(notification.id, getJWTFromLocalStorage().access )
        }, navigate)
        if (response){
            if (response.status == 200){
                removeAndUpdateNotifications(notification, setNotifications)
            } else {
                toast.error('¡ Ha ocurrido un error eliminando la notificación !')
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
        initStates(notifications, setNotifications)
    }, [])
    return (
        <div className="notifications-container">
            <div className="notifications-bell-container">
                <Button buttonText="Notificaciones" onClickFunction={handleNotificationsBellClick} />
                <div className={notifications.length > 0? "notifications-alert notifications-alert__activated" : "notifications-alert"}></div>
            </div>
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

