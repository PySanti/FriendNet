import { useContext, useEffect, useState } from "react"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
import { getUsersListAPI } from "../api/getUsersList.api"
import { LoadingContext } from "../context/LoadingContext"
import { getMessagesHistorialAPI } from "../api/getMessagesHistorial.api"
import { Loader } from "../components/Loader"
import { sendMsgAPI } from "../api/sendMsg.api"
import { NotificationsContainer } from "../components/NotificationsContainer"
import { UsersList } from "../components/UsersList"
import { Chat } from "../components/Chat"
import { Button } from "../components/Button"
import "../styles/Home.css"
import { getNotificationsFromLocalStorage } from "../utils/getNotificationsFromLocalStorage"
import { removeNotificationFromLocalStorage } from "../utils/removeNotificationFromLocalStorage"
import { getJWTFromLocalStorage } from "../utils/getJWTFromLocalStorage"
import { getChatGlobesList } from "../utils/getChatGlobesList"
import { removeRelatedNotifications } from "../utils/removeRelatedNotifications"
import { saveNotificationsInLocalStorage } from "../utils/saveNotificationsInLocalStorage"
import { validateJWT } from "../utils/validateJWT"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_JWT_ERROR_LOG} from "../utils/constants"
import {logoutUser} from "../utils/logoutUser"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
/**
 * Pagina principal del sitio
 */
export function Home() {
    let {loadingState, setLoadingState,startLoading,  successfullyLoaded} = useContext(LoadingContext)
    let [notifications, setNotifications] = useState(null)
    let [messagesHistorial, setMessagesHistorial] = useState(null)
    let [clickedUser, setClickedUser] = useState(null)
    let [userList, setUserList] = useState(false)
    let [chatGlobeList, setChatGlobeList] = useState(null)
    let [user] = useState(getUserDataFromLocalStorage())
    let [goToProfile, setGoToProfile] = useState(false)
    const navigate = useNavigate()
    const loadUsersList = async ()=>{
        startLoading()
        try{
            let response = await getUsersListAPI(undefined, user.id)
            setUserList(response.data.users_list)
            successfullyLoaded()
        } catch(error){
            setLoadingState(error.message === BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : 'Error inesperado cargando datos de usuarios!')
        }
    }
    const onMsgSending = async (data)=>{
        startLoading()
        const successValidating = await validateJWT()
        if (successValidating){
            try {
                await sendMsgAPI(clickedUser.id, data.msg, getJWTFromLocalStorage().access)
                successfullyLoaded()
                await loadMessages()
            } catch(error){
                setLoadingState(error.message === BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : 'Error inesperado en respuesta del servidor, no se pudo enviar el mensaje !')
            }
        } else {
            setLoadingState(BASE_JWT_ERROR_LOG)
        }
    }
    const loadMessages = async ()=>{
        startLoading()
        const successValidating = await validateJWT()
        if (successValidating){
            try{
                const response = await getMessagesHistorialAPI(clickedUser.id, getJWTFromLocalStorage().access)
                if (response.data !== "no_messages_between"){
                    setMessagesHistorial(response.data.messages_hist)
                } else {
                    setMessagesHistorial(null)
                }
                successfullyLoaded()
            } catch(error){
                setLoadingState(error.message === BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : 'Error inesperado buscando chat!')
            }
        } else {
            setLoadingState(BASE_JWT_ERROR_LOG)
        }
    }
    const onLogout = async ()=>{
        startLoading()
        const successValidating = await validateJWT()
        if (successValidating){ 
            await logoutUser()
            successfullyLoaded()
        } else {
            setLoadingState(BASE_JWT_ERROR_LOG)
        }
    }
    const onNotificationDelete = (notification)=>{
        const updatedNotifications = removeNotificationFromLocalStorage(notification)
        setNotifications(updatedNotifications)
        setChatGlobeList(getChatGlobesList(updatedNotifications))
    }
    const onUserButtonClick = (clickedUser)=>{
        const updatedNotifications = removeRelatedNotifications(clickedUser.id, notifications)
        if(updatedNotifications){
            saveNotificationsInLocalStorage(updatedNotifications)
            setNotifications(updatedNotifications)
            setChatGlobeList(getChatGlobesList(updatedNotifications))
        }
        setClickedUser(clickedUser)
    }
    const onNotificationClick = (notification)=>{
        onUserButtonClick(notification.sender_user)
    }
    const loadUserNotifications = ()=>{
        const notifications = getNotificationsFromLocalStorage()
        setNotifications(notifications)
        setChatGlobeList(getChatGlobesList(notifications))
    }
    useEffect(()=>{
        if(goToProfile){
            navigate("/home/profile/")
        }
    }, [goToProfile])
    useEffect(()=>{
        setLoadingState(false)
        if (userIsAuthenticated() && !userList){
            loadUsersList()
            loadUserNotifications()
        }
    }, [])
    useEffect(()=>{
        if (clickedUser){
            loadMessages()
        }
    }, [clickedUser])

    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else {
        return (
            <div className="centered-container">
                <div className="home-container">
                    <Header username={user.username}/>
                    <div className="buttons-container">
                        <NotificationsContainer notificationList={notifications} onNotificationClick={onNotificationClick} onNotificationDelete={onNotificationDelete} />
                        <Button buttonText="Salir" onClickFunction={onLogout}/>
                        <Button buttonText="Perfil" onClickFunction={()=>{setGoToProfile(true)}}/>
                    </div>
                    <Loader state={loadingState}/>
                    <div className="users-interface-container">
                        {userList && 
                            <>
                                <UsersList 
                                    usersList={userList} 
                                    onClickEvent={onUserButtonClick} 
                                    chatGlobeList={chatGlobeList} 
                                    usersListSetter={setUserList} 
                                    sessionUserId={user.id}/>
                                <Chat 
                                    chatingUser={clickedUser} 
                                    messages={messagesHistorial} 
                                    sessionUserId={user.id} 
                                    onMsgSending={onMsgSending}/>
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    }
}