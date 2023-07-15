import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
import { getUsersListAPI } from "../api/getUsersList.api"
import { LoadingContext } from "../context/LoadingContext"
import "../styles/home-styles.css"
import { getChatBetweenAPI } from "../api/getChatBetween.api"
import { Loader } from "../components/Loader"
import { sendMsgAPI } from "../api/sendMsg.api"
import { UsersInterface } from "../components/UsersInterface"
import { getUserNotifications } from "../api/getUserNotifications.api"
import { Notifications } from "../components/Notifications"
import { removeNotificationAPI } from "../api/removeNotification.api"
import { Button } from "../components/Button"
/**
 * Pagina principal del sitio
 */
export function Home() {
    let {loadingState, setLoadingState,startLoading,  successfullyLoaded} = useContext(LoadingContext)
    let [notifications, setNotifications] = useState(null)
    let [messagesHistorial, setMessagesHistorial] = useState(null)
    let [clickedUser, setClickedUser] = useState(null)
    let [userList, setUserList] = useState(false)
    const {user, logoutUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const onMsgSending = async (data)=>{
        startLoading()
        try {
            console.log('enviando mensaje')
            const response = await sendMsgAPI(clickedUser.id, user.user_id, data.msg)
            successfullyLoaded()
        } catch(error){
            console.log(error)
        }
    }
    const onUserButtonClick = async (clicked_user)=>{
        setClickedUser(clicked_user)
        startLoading()
        try{
            const response = await getChatBetweenAPI(user.user_id, clicked_user.id)
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
    const onNotificationClick = async (notificationCode, notificationId)=>{
        startLoading()
        if (notificationCode !== "u"){
            let user = undefined
            userList.forEach(element => {
                if (element.id == notificationCode){
                    user= element
                }
            });
            if (user){
                onUserButtonClick(user)
                successfullyLoaded()
            } else {
                setLoadingState("Error inesperado")
            }
        } else {
            setGoToProfile(true)
        }
        const response = await removeNotificationAPI(notificationId)
    }
    const loadUserNotifications = async ()=>{
        startLoading()
        try{
            const response = await getUserNotifications(user.user_id)
            if (response.data.notifications.length){
                setNotifications(response.data.notifications)
            }
            successfullyLoaded()
        } catch(error){
            setLoadingState('Error inesperado al cargar notificaciones del usuario')
        }
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

    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else {
        return (
            <>
                <Header username={user.username}/>
                <Loader state={loadingState}/>
                <UsersInterface 
                        usersList={userList} 
                        onUserButtonClick={onUserButtonClick} 
                        session_user_id={user.user_id} 
                        clickedUser={clickedUser} 
                        messagesHistorial={messagesHistorial} 
                        onMsgSending={onMsgSending}/>
                <div className="buttons-container">
                    <Button buttonText="Salir" onClickFunction={logoutUser}/>
                    <Button buttonText="Perfil" onClickFunction={()=>{setGoToProfile(true)}}/>
                </div>
                <Notifications notificationList={notifications} onNotificationClick={onNotificationClick} />
            </>
        )
    }
}