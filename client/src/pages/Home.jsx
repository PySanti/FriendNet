import { useEffect, useState } from "react"
import {logoutUser} from "../utils/logoutUser"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
import { Loader } from "../components/Loader"
import { NotificationsContainer } from "../components/NotificationsContainer"
import { UsersList } from "../components/UsersList"
import { Chat } from "../components/Chat"
import { Button } from "../components/Button"
import "../styles/Home.css"
import {disconnectWebsocket} from "../utils/disconnectWebsocket" 
import {CHAT_WEBSOCKET} from "../utils/constants"
import {useClickedUser} from "../store/clickedUserStore"
import {useMessagesHistorial} from "../store/messagesHistorialStore"
import {useLastClickedUser} from "../store/lastClickedUserStore"
/**
 * Pagina principal del sitio
 */
export function Home() {
    const navigate = useNavigate()
    let [clickedUser, setClickedUser]   = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let setMessagesHistorial            = useMessagesHistorial((state)=>(state.setMessagesHistorial))
    let setLastClickedUser              = useLastClickedUser((state)=>(state.setLastClickedUser))

    const onUserButtonClick = (newClickedUser)=>{
        setLastClickedUser(clickedUser);
        setClickedUser(newClickedUser)
    }

    useEffect(()=>{
        return ()=>{
            // esto se ejecutara cuando el componente sea desmontado
            setClickedUser(null)
            setLastClickedUser(null)
            setMessagesHistorial([])
            disconnectWebsocket(CHAT_WEBSOCKET)
        }
    }, [])

    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else {
        return (
            <div className="centered-container">
                <div className="home-container">
                    <Header msg="En el home"/>
                    <div className="buttons-container">
                        <NotificationsContainer onNotificationClick={(notification)=>onUserButtonClick(notification.sender_user)} />
                        <Button buttonText="Salir" onClickFunction={()=>logoutUser(navigate)}/>
                        <Button buttonText="Perfil" onClickFunction={()=>{navigate('/home/profile/')}}/>
                    </div>
                    <Loader/>
                    <div className="users-interface-container">
                        <UsersList  onClickEvent={onUserButtonClick}/>
                        <Chat/>
                    </div>
                </div>
            </div>
        )
    }
}