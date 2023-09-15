import { useContext, useEffect, useState } from "react"

import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
import { LoadingContext } from "../context/LoadingContext"
import { Loader } from "../components/Loader"
import { BASE_JWT_ERROR_LOG, BASE_LOGIN_REQUIRED_ERROR_MSG} from "../utils/constants"
import { NotificationsContainer } from "../components/NotificationsContainer"
import { UsersList } from "../components/UsersList"
import { Chat } from "../components/Chat"
import { Button } from "../components/Button"
import "../styles/Home.css"
import {redirectExpiredUser} from "../utils/redirectExpiredUser"
import { getNotificationsFromLocalStorage } from "../utils/getNotificationsFromLocalStorage"
import { removeNotificationFromLocalStorage } from "../utils/removeNotificationFromLocalStorage"
import { getChatGlobesList } from "../utils/getChatGlobesList"
import { removeRelatedNotifications } from "../utils/removeRelatedNotifications"
import { saveNotificationsInLocalStorage } from "../utils/saveNotificationsInLocalStorage"
import { validateJWT } from "../utils/validateJWT"
import {logoutUser} from "../utils/logoutUser"
import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {disconnectWebsocket} from "../utils/disconnectWebsocket" 
import {MAIN_WEBSOCKET} from "../utils/constants"
/**
 * Pagina principal del sitio
 */
export function Home() {
    const user = getUserDataFromLocalStorage()
    const navigate = useNavigate()
    const loadingStateHandlers = useContext(LoadingContext)
    let {loadingState, setLoadingState,startLoading,  successfullyLoaded} = loadingStateHandlers
    let [notifications, setNotifications] = useState(getNotificationsFromLocalStorage())
    let [chatGlobeList, setChatGlobeList] = useState(getChatGlobesList(notifications))
    let [clickedUser, setClickedUser] = useState(null)
    let [lastClickedUser, setLastClickedUser] = useState(null)


    useEffect(()=>{
        return ()=>{
            // esto se ejecutara cuando el componente sea desmontado
            disconnectWebsocket(MAIN_WEBSOCKET)
        }
    }, [])
    const onLogout = async ()=>{
        startLoading()
        const successValidating = await validateJWT()
        if (successValidating === true){ 
            await logoutUser()
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
        setLastClickedUser(clickedUser);
        setClickedUser(newClickedUser)
    }

    useEffect(()=>{
        if (diferentUserHasBeenClicked(lastClickedUser, clickedUser)){
            const updatedNotifications = removeRelatedNotifications(clickedUser.id, notifications)
            if(updatedNotifications){
                saveNotificationsInLocalStorage(updatedNotifications)
                setNotifications(updatedNotifications)
                setChatGlobeList(getChatGlobesList(updatedNotifications))
            }
        }
    }, [clickedUser])

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
                            clickedUser={clickedUser} 
                            lastClickedUser={lastClickedUser}
                            sessionUserId={user.id} 
                            loadingStateHandlers ={loadingStateHandlers}
                            />
                    </div>
                </div>
            </div>
        )
    }
}