import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
import { getUsersListAPI } from "../api/getUsersList.api"
import { LoadingContext } from "../context/LoadingContext"
import { getChatBetweenAPI } from "../api/getChatBetween.api"
import { Loader } from "../components/Loader"
import { sendMsgAPI } from "../api/sendMsg.api"
import { UsersInterface } from "../components/UsersInterface"
import { NotificationsContainer } from "../components/NotificationsContainer"
import { Button } from "../components/Button"
import "../styles/Home.css"
import { getNotificationsFromLocalStorage } from "../utils/getNotificationsFromLocalStorage"
import { removeNotificationFromLocalStorage } from "../utils/removeNotificationFromLocalStorage"
import { getUserFromList } from "../utils/getUserFromList"
import { getChatGlobesList } from "../utils/getChatGlobesList"
import { removeRelatedNotifications } from "../utils/removeRelatedNotifications"
import { saveNotificationsInLocalStorage } from "../utils/saveNotificationsInLocalStorage"
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
    const {user, logoutUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const onMsgSending = async (data)=>{
        startLoading()
        try {
            await sendMsgAPI(clickedUser.id, user.user_id, data.msg)
            successfullyLoaded()
            loadMessages()
        } catch(error){
            setLoadingState('Error inesperado en respuesta del servidor, no se pudo enviar el mensaje !')
        }
    }
    const loadMessages = async ()=>{
        startLoading()
        try{
            const response = await getChatBetweenAPI(user.user_id, clickedUser.id)
            if (response.data !== "no_chats_between"){
                setMessagesHistorial(response.data.messages_hist)
            } else {
                setMessagesHistorial(null)
            }
            successfullyLoaded()
        } catch(error){
            setLoadingState('Error inesperado buscando chat!')
        }
    }
    const onNotificationDelete = (notification)=>{
        setNotifications(removeNotificationFromLocalStorage(notification))
    }
    const onUserButtonClick = (clicked_user)=>{
        const updatedNotifications = removeRelatedNotifications(clicked_user.id, notifications)
        if(updatedNotifications){
            saveNotificationsInLocalStorage(updatedNotifications)
            setNotifications(updatedNotifications)
            setChatGlobeList(getChatGlobesList(updatedNotifications))
        }
        setClickedUser(clicked_user)
    }
    const loadUsersList = async ()=>{
        try{
            startLoading()
            const response = await getUsersListAPI(user.user_id)
            setUserList(response.data.users_list)
            successfullyLoaded()
        } catch(error){
            setLoadingState('Error inesperado cargando datos de usuarios!')
        }
    }
    const onNotificationClick = (notification)=>{
        startLoading()
        if (notification.code !== "u"){
            const user = getUserFromList(userList, notification.code)
            if (user){
                onUserButtonClick(user)
                successfullyLoaded()
            } else {
                setLoadingState('Tuvimos problemas para encontrar a ese usuario :(')
            }
        } else {
            setGoToProfile(true)
            successfullyLoaded()
        }
    }
    const loadUserNotifications = ()=>{
        const notifications = getNotificationsFromLocalStorage()
        setNotifications(notifications)
        setChatGlobeList(getChatGlobesList(notifications))
    }
    let [goToProfile, setGoToProfile] = useState(false)
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
                        <Button buttonText="Salir" onClickFunction={logoutUser}/>
                        <Button buttonText="Perfil" onClickFunction={()=>{setGoToProfile(true)}}/>
                    </div>
                    <Loader state={loadingState}/>
                    <UsersInterface 
                            usersList={userList} 
                            onUserButtonClick={onUserButtonClick} 
                            session_user_id={user.user_id} 
                            clickedUser={clickedUser} 
                            messagesHistorial={messagesHistorial} 
                            chatGlobeList={chatGlobeList}
                            onMsgSending={onMsgSending}/>
                </div>
            </div>
        )
    }
}