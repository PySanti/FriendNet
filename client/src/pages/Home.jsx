import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
import { getUsersListAPI } from "../api/getUsersList.api"
import { SubmitStateContext } from "../context/SubmitStateContext"
import "../styles/home-styles.css"
import { getChatBetweenAPI } from "../api/getChatBetween.api"
import { Loader } from "../components/Loader"
import { UnExpectedError } from "../components/UnExpectedError"
import { sendMsgAPI } from "../api/sendMsg.api"
import { UsersInterface } from "../components/UsersInterface"
import { getUserNotifications } from "../api/getUserNotifications.api"
import { Notifications } from "../components/Notifications"
import { startsWith } from "lodash"
/**
 * Pagina principal del sitio
 */
export function Home() {
    let {loadingState, unExpectedError, handleUnExpectedError, startLoading, nullSubmitStates, successfullyLoaded} = useContext(SubmitStateContext)
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
            handleUnExpectedError('Error inesperado buscando chat!')
        }
    }
    const loadUsersList = async ()=>{
        try{
            startLoading()
            const response = await getUsersListAPI(user.user_id)
            setUserList(response.data.users_list)
            successfullyLoaded()
        } catch(error){
            handleUnExpectedError('Error inesperado cargando datos de usuarios!')
        }
    }
    const onNotificationClick = (notificationCode)=>{
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
                handleUnExpectedError("Error inesperado")
            }
        }
    }
    const loadUserNotifications = async ()=>{
        startLoading()
        try{
            const response = await getUserNotifications(user.user_id)
            setNotifications(response.data.notifications)
        } catch(error){
            handleUnExpectedError('Error inesperado al cargar notificaciones del usuario')
        }
    }
    let [goToProfile, setGoToProfile] = useState(false)
    useEffect(()=>{
        if(goToProfile){
            navigate("/home/profile/")
        }
    }, [goToProfile])
    useEffect(()=>{
        nullSubmitStates()
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
                {loadingState && <Loader state={loadingState}/>}
                {unExpectedError && <UnExpectedError msg={unExpectedError}/>}
                {userList && 
                    <UsersInterface 
                        usersList={userList} 
                        onUserButtonClick={onUserButtonClick} 
                        session_user_id={user.user_id} 
                        clickedUser={clickedUser} 
                        messagesHistorial={messagesHistorial} 
                        onMsgSending={onMsgSending}/>
                }
                <button onClick={logoutUser}>Salir</button>
                <button onClick={()=>{setGoToProfile(true)}}>Perfil</button>
                {notifications && <Notifications notificationList={notifications} onNotificationClick={onNotificationClick} />}
            </>
        )
    }
}