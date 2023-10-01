import { useContext, useEffect, useState, useRef } from "react"
import {logoutUser} from "../utils/logoutUser"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
import { LoadingContext } from "../context/LoadingContext"
import { Loader } from "../components/Loader"
import { NotificationsContainer } from "../components/NotificationsContainer"
import { UsersList } from "../components/UsersList"
import { Chat } from "../components/Chat"
import { Button } from "../components/Button"
import "../styles/Home.css"
import { getNotificationsFromLocalStorage } from "../utils/getNotificationsFromLocalStorage"
import { removeNotificationFromLocalStorage } from "../utils/removeNotificationFromLocalStorage"
import { getChatGlobesList } from "../utils/getChatGlobesList"
import { getRelatedNotification } from "../utils/getRelatedNotification"
import { saveNotificationsInLocalStorage } from "../utils/saveNotificationsInLocalStorage"
import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {disconnectWebsocket} from "../utils/disconnectWebsocket" 
import {CHAT_WEBSOCKET} from "../utils/constants"
import {notificationDeleteAPI} from "../api/notificationDelete.api"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants" 
import {NotificationsWSInitialize} from "../utils/NotificationsWSInitialize"
import {NotificationsWSUpdate} from "../utils/NotifcationsWSUpdate"
import {executeSecuredApi} from "../utils/executeSecuredApi"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_UNEXPECTED_ERROR_MESSAGE, BASE_UNEXPECTED_ERROR_LOG} from "../utils/constants"
import {enterChatAPI} from "../api/enterChat.api"
import {updateMessagesHistorial} from "../utils/updateMessagesHistorial"
import {useClickedUser} from "../store/clickedUserStore"

/**
 * Pagina principal del sitio
 */
export function Home() {
    const user = getUserDataFromLocalStorage()
    const navigate = useNavigate()
    const loadingStateHandlers = useContext(LoadingContext)
    let {loadingState, setLoadingState, startLoading, successfullyLoaded}   = loadingStateHandlers
    let [notifications, setNotifications]                                   = useState(getNotificationsFromLocalStorage())
    let [chatGlobeList, setChatGlobeList]                                   = useState([])
    let [clickedUser, setClickedUser]                                       = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let [lastClickedUser, setLastClickedUser]                               = useState(null)
    let [currentUserIsOnline, setCurrentUserIsOnline]                       = useState(false)
    let [messagesHistorial, setMessagesHistorial]                           = useState([])
    let messagesHistorialPage                                               = useRef(1)
    let noMoreMessages                                                      = useRef(false)


    const enterChatHandler = async ()=>{
        const relatedNotification = getRelatedNotification(clickedUser.id, notifications)
        startLoading()
        const response = await executeSecuredApi(async ()=>{
            return await enterChatAPI(clickedUser.id, relatedNotification? relatedNotification.id : undefined, getJWTFromLocalStorage().access)
        }, navigate)
        if (response){
            if (response.status == 200){
                updateMessagesHistorial(setMessagesHistorial, messagesHistorialPage, response.data.messages_hist!== "no_messages_between" ? response.data.messages_hist : [], messagesHistorial)
                setCurrentUserIsOnline(response.data.is_online)
                if (relatedNotification && response.data.notification_deleted){
                    const updatedNotifications = removeNotificationFromLocalStorage(relatedNotification)
                    saveNotificationsInLocalStorage(updatedNotifications)
                    setNotifications(updatedNotifications)
                }
                successfullyLoaded()
            } else if (response.status == 400){
                setLoadingState({
                    "user_not_found"                    : "Tuvimos problemas para encontrar a ese usuario!",
                    "error_while_checking_is_online"    : 'Error comprobando si el usuario esta en linea!',
                    "error_while_getting_messages"      : 'Error buscando mensajes!',
                    "error_while_deleting_notification" : 'Error borrando notificacion !'
                }[response.data.error])
            }  else if (response == BASE_FALLEN_SERVER_ERROR_MSG || response == BASE_UNEXPECTED_ERROR_MESSAGE){
                setLoadingState({
                    BASE_FALLEN_SERVER_ERROR_MSG : BASE_FALLEN_SERVER_LOG,
                    BASE_UNEXPECTED_ERROR_MESSAGE : BASE_UNEXPECTED_ERROR_LOG
                }[response])
            }
        }

    }
    const onNotificationDelete = async (notification)=>{
        const response = await executeSecuredApi(async ()=>{
            return await notificationDeleteAPI(notification.id, getJWTFromLocalStorage().access )
        }, navigate)
        if (response){
            if (response.status == 200){
                const updatedNotifications = removeNotificationFromLocalStorage(notification)
                saveNotificationsInLocalStorage(updatedNotifications)
                setNotifications(updatedNotifications)
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
    const onUserButtonClick = (newClickedUser)=>{
        setLastClickedUser(clickedUser);
        setClickedUser(newClickedUser)
    }

    useEffect(()=>{
        if (!NOTIFICATIONS_WEBSOCKET.current && user){
            NotificationsWSInitialize(user.id)
            NotificationsWSUpdate(user.id, notifications,setNotifications, navigate )
        }
        return ()=>{
            // esto se ejecutara cuando el componente sea desmontado
            disconnectWebsocket(CHAT_WEBSOCKET)
        }
    }, [])
    useEffect(()=>{
        if (diferentUserHasBeenClicked(lastClickedUser, clickedUser)){
            (async function() {
                messagesHistorialPage.current = 1
                noMoreMessages.current = false
                setCurrentUserIsOnline(false)
                await enterChatHandler()
            })();
        }
    }, [clickedUser])
    useEffect(()=>{
        setChatGlobeList(getChatGlobesList(notifications))
    }, [notifications])
    useEffect(()=>{
        if (!NOTIFICATIONS_WEBSOCKET.current && user){
            NotificationsWSUpdate(user.id, notifications,setNotifications )
        }
    }, [notifications])

    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else {
        return (
            <div className="centered-container">
                <div className="home-container">
                    <Header username={user.username} msg="En el home"/>
                    <div className="buttons-container">
                        <NotificationsContainer notificationList={notifications} onNotificationClick={(notification)=>onUserButtonClick(notification.sender_user)} onNotificationDelete={onNotificationDelete} />
                        <Button buttonText="Salir" onClickFunction={()=>logoutUser(navigate)}/>
                        <Button buttonText="Perfil" onClickFunction={()=>{navigate('/home/profile/')}}/>
                    </div>
                    <Loader state={loadingState}/>
                    <div className="users-interface-container">
                        <UsersList  
                            onClickEvent={onUserButtonClick}  
                            chatGlobeList={chatGlobeList}  
                            loadingStateHandlers={loadingStateHandlers}
                            sessionUserId = {user.id}
                        />
                        <Chat 
                            sessionUserId={user.id} 
                            loadingStateHandlers ={loadingStateHandlers}
                            messagesHistorial={messagesHistorial}
                            setMessagesHistorial={setMessagesHistorial}
                            messagesHistorialPage={messagesHistorialPage}
                            currentUserIsOnline={currentUserIsOnline}
                            setCurrentUserIsOnline = {setCurrentUserIsOnline}
                            noMoreMessages = {noMoreMessages}
                            />
                    </div>
                </div>
            </div>
        )
    }
}