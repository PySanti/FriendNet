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
import {NotificationsWSInitialize} from "../utils/NotificationsWSInitialize"
import {useNavigate} from "react-router-dom"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeSecuredApi} from "../utils/executeSecuredApi"
import {notificationDeleteAPI} from "../api/notificationDelete.api"
import {useLoadingState} from "../store/loadingStateStore"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import {getNotificationsFromLocalStorage} from "../utils/getNotificationsFromLocalStorage"
import {handleStandardApiErrors} from "../utils/handleStandardApiErrors"
import {useUsersList} from "../store/usersListStore"
import {useClickedUser} from "../store/clickedUserStore"
import {useLastClickedUser} from "../store/lastClickedUserStore"
import {saveNotificationsInLocalStorage} from "../utils/saveNotificationsInLocalStorage"
import {logoutUser} from "../utils/logoutUser"

/**
 * Componente creado para contener las notificaciones del usuarios
 * @param {Function} onNotificationClick funcion que se ejecutara cuando se clickee una notificacion
 */
export function NotificationsContainer({onNotificationClick}){
    let [notificacionsActivated, setNotificationsActivated] = useState(false)
    let [setChatGlobeList] = useChatGlobeList((state)=>([state.setChatGlobeList]))
    let [notifications, setNotifications] = useNotifications((state)=>([state.notifications, state.setNotifications]))
    let [usersList, setUsersList] = useUsersList((state)=>([state.usersList, state.setUsersList]))
    let [clickedUser, setClickedUser] = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let setLastClickedUser = useLastClickedUser((state)=>(state.setLastClickedUser))
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
    }, [notifications])
    useEffect(()=>{
        if (NOTIFICATIONS_WEBSOCKET.current && userData){
            NOTIFICATIONS_WEBSOCKET.current.onmessage = (event)=>{
                const data = JSON.parse(event.data)
                console.log('Recibiendo datos a traves del websocket de notificaciones')
                console.log(data)
                if (data.type == "new_notification"){
                    if (data.value.new_notification.sender_user.id != userData.id){
                        const updatedNotifications = [...notifications, data.value.new_notification]
                        setNotifications(updatedNotifications)
                        saveNotificationsInLocalStorage(updatedNotifications)
                    }
                } else if (data.type == "connection_error"){
                    logoutUser(navigate)
                } else  if (data.type === "updated_user"){
                    setUsersList(usersList.map(user => {
                        if (user.id == data.value.id){
                            return data.value
                        } else {
                            return user
                        }
                    }))
                    if (clickedUser && data.value.id == clickedUser.id){
                        setLastClickedUser(clickedUser)
                        data.value.is_online = clickedUser.is_online
                        setClickedUser(data.value)
                    }
                }
            }
        }
    }, [usersList, clickedUser, notifications])
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

NotificationsContainer.propTypes = {
    onNotificationClick : PropTypes.func.isRequired,
}

