import { useContext, useEffect, useState, useRef } from "react"

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
import {redirectExpiredUser} from "../utils/redirectExpiredUser"
import { getNotificationsFromLocalStorage } from "../utils/getNotificationsFromLocalStorage"
import { removeNotificationFromLocalStorage } from "../utils/removeNotificationFromLocalStorage"
import { getJWTFromLocalStorage } from "../utils/getJWTFromLocalStorage"
import { getChatGlobesList } from "../utils/getChatGlobesList"
import { removeRelatedNotifications } from "../utils/removeRelatedNotifications"
import { saveNotificationsInLocalStorage } from "../utils/saveNotificationsInLocalStorage"
import { validateJWT } from "../utils/validateJWT"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_JWT_ERROR_LOG, BASE_LOGIN_REQUIRED_ERROR_MSG} from "../utils/constants"
import {logoutUser} from "../utils/logoutUser"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
/**
 * Pagina principal del sitio
 */
export function Home() {
    let {loadingState, setLoadingState,startLoading,  successfullyLoaded} = useContext(LoadingContext)
    let [notifications, setNotifications] = useState(getNotificationsFromLocalStorage())
    let [chatGlobeList, setChatGlobeList] = useState(getChatGlobesList(notifications))
    let [messagesHistorial, setMessagesHistorial] = useState([])
    let [clickedUser, setClickedUser] = useState(null)

    // userFilter
    let [userKeyword, setUserKeyword] = useState(undefined)

    // pagination
    let [gottaUpdateUserList, setGottaUpdateUserList]           = useState(false)
    let userListPage                                            = useRef(1)
    let [noMorePages, setNoMorePages]                           = useState(false)
    let [userListLoaderActivated, setUserListLoaderActivated]   = useState(true)
    let [userList, setUserList]                                 = useState([])

    const user = getUserDataFromLocalStorage()
    let [goToProfile, setGoToProfile] = useState(false)
    const navigate = useNavigate()
    const updateUserList = (newUsers)=>{
        if (userListPage.current === 1){
            setUserList(newUsers)
        } else {
            setUserList(userList.concat(newUsers))
        }
    }
    const addMessage = (new_msg)=>{
        messagesHistorial.push(new_msg)
        setMessagesHistorial(messagesHistorial)
    }
    const loadUsersList = async ()=>{
        startLoading()
        try{
            setUserListLoaderActivated(true)
            let response = await getUsersListAPI(!userKeyword || userKeyword.length === 0 ? undefined : userKeyword, user.id, userListPage.current)
            updateUserList(response.data.users_list)
            setUserListLoaderActivated(false)
            successfullyLoaded()
        } catch(error){
            if (error.message === BASE_FALLEN_SERVER_ERROR_MSG){
                setLoadingState(BASE_FALLEN_SERVER_LOG)
            } else {
                if (error.response.data.error=== "no_more_pages"){
                    setNoMorePages(true)
                    setUserListLoaderActivated(false)
                    successfullyLoaded()
                } else {
                    setLoadingState('Error inesperado cargando datos de usuarios!')
                }
            }
        }
    }
    const onMsgSending = async (data)=>{
        startLoading()
        const successValidating = await validateJWT()
        if (successValidating === true){
            try {
                const response = await sendMsgAPI(clickedUser.id, data.msg, getJWTFromLocalStorage().access)
                addMessage(response.data.sended_msg)
                successfullyLoaded()
            } catch(error){
                setLoadingState(error.message === BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : 'Error inesperado en respuesta del servidor, no se pudo enviar el mensaje !')
            }
        } else {
            if (successValidating === BASE_LOGIN_REQUIRED_ERROR_MSG){
                redirectExpiredUser(navigate)
            } else {
                setLoadingState(BASE_JWT_ERROR_LOG)
            }
        }
    }
    const loadMessages = async ()=>{
        startLoading()
        const successValidating = await validateJWT()
        if (successValidating === true){
            try{
                const response = await getMessagesHistorialAPI(clickedUser.id, getJWTFromLocalStorage().access)
                setMessagesHistorial(response.data !== "no_messages_between" ? response.data.messages_hist : [])
                successfullyLoaded()
            } catch(error){
                setLoadingState(error.message === BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : 'Error inesperado buscando chat!')
            }
        } else {
            if (successValidating === BASE_LOGIN_REQUIRED_ERROR_MSG){
                redirectExpiredUser(navigate)
            } else {
                setLoadingState(BASE_JWT_ERROR_LOG)
            }
        }
    }
    const onLogout = async ()=>{
        startLoading()
        const successValidating = await validateJWT()
        if (successValidating === true){ 
            await logoutUser(true)
            successfullyLoaded()
        } else {
            if (successValidating === BASE_LOGIN_REQUIRED_ERROR_MSG){
                redirectExpiredUser(navigate)
            } else {
                setLoadingState(BASE_JWT_ERROR_LOG)
            }
        }
    }
    const onNotificationDelete = (notification)=>{
        const updatedNotifications = removeNotificationFromLocalStorage(notification)
        setNotifications(updatedNotifications)
        setChatGlobeList(getChatGlobesList(updatedNotifications))
    }
    const onUserButtonClick = (newClickedUser)=>{
        if (!clickedUser || newClickedUser.id !== clickedUser.id){
            const updatedNotifications = removeRelatedNotifications(newClickedUser.id, notifications)
            if(updatedNotifications){
                saveNotificationsInLocalStorage(updatedNotifications)
                setNotifications(updatedNotifications)
                setChatGlobeList(getChatGlobesList(updatedNotifications))
            }
            setClickedUser(newClickedUser)
        }
    }


    useEffect(()=>{
        if(goToProfile){
            navigate("/home/profile/")
        }
    }, [goToProfile])
    useEffect(()=>{
        async function initializeUserList(){
            setLoadingState(false)
            if (userIsAuthenticated() && userList.length === 0){
                await loadUsersList()
                userListPage.current = 2
            }
        }
        initializeUserList()
    }, [])
    useEffect(()=>{
        if (clickedUser){
            loadMessages()
        }
    }, [clickedUser])
    useEffect(()=>{
        if (gottaUpdateUserList){
            const updateList = async ()=>{
                if (!noMorePages){
                    await loadUsersList()
                    userListPage.current += 1
                }
                setGottaUpdateUserList(false)
            }
            updateList()
        }
    }, [gottaUpdateUserList])
    useEffect(()=>{
        if (userKeyword !== undefined){ // si userKeyword esta inicializado ...
            const updateList = async ()=>{
                userListPage.current = 1
                setNoMorePages(false)
                await loadUsersList()
            }
            updateList()
        }
    }, [userKeyword])
    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else {
        return (
            <div className="centered-container">
                <div className="home-container">
                    <Header username={user.username} msg="En el home"/>
                    <div className="buttons-container">
                        <NotificationsContainer notificationList={notifications} onNotificationClick={(notification)=>onUserButtonClick(notification.sender_user)} onNotificationDelete={onNotificationDelete} />
                        <Button buttonText="Salir" onClickFunction={onLogout}/>
                        <Button buttonText="Perfil" onClickFunction={()=>{setGoToProfile(true)}}/>
                    </div>
                    <Loader state={loadingState}/>
                    <div className="users-interface-container">
                        <UsersList  
                        usersList={userList}  
                        onClickEvent={onUserButtonClick}  
                        chatGlobeList={chatGlobeList}  
                        gottaUpdateListSetter={setGottaUpdateUserList} 
                        loaderActivated={userListLoaderActivated} 
                        userKeyword={userKeyword}
                        userKeywordSetter={setUserKeyword}
                        />
                        <Chat chatingUser={clickedUser} messages={messagesHistorial} sessionUserId={user.id} onMsgSending={onMsgSending}/>
                    </div>
                </div>
            </div>
        )
    }
}