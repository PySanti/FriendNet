import { useEffect } from "react"
import {logoutUser} from "../utils/logoutUser"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { useNavigate } from "react-router-dom"
import { NotificationsContainer } from "../components/NotificationsContainer"
import { UsersList } from "../components/UsersList"
import { Chat } from "../components/Chat"
import { Button } from "../components/Button"
import "../styles/Home.css"
import {disconnectWebsocket} from "../utils/disconnectWebsocket" 
import {CHAT_WEBSOCKET} from "../utils/constants"
// import { destroy } from 'zustand';
import {resetGlobalStates} from "../utils/resetGlobalStates"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"

/**
 * Pagina principal del sitio
 */
export function Home() {
    const navigate                      = useNavigate()
    useEffect(()=>{
        document.title = generateDocumentTitle("Home")
        return ()=>{
            // esto se ejecutara cuando el componente sea desmontado
            resetGlobalStates(["useClickedUser", "useLastClickedUser", "useMessagesHistorial"])
            disconnectWebsocket(CHAT_WEBSOCKET)
        }
    }, [])

    if (!userIsAuthenticated()){
        return <UserNotLogged msg="No puedes acceder al Home si aun no has iniciado sesión o no tienes cuenta"/>
    } else {
        return (
            <div className="centered-container">
                <div className="buttons-container">
                    <NotificationsContainer/>
                    <Button buttonText="Salir" onClickFunction={()=>logoutUser(navigate)}/>
                    <Button buttonText="Perfil" onClickFunction={()=>{navigate('/home/profile/')}}/>
                </div>
                <div className="users-interface-container">
                    <UsersList/>
                    <Chat/>
                </div>
            </div>
        )
    }
}