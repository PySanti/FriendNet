import { useEffect } from "react"
import {logoutUser} from "../utils/logoutUser"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
import { NotificationsContainer } from "../components/NotificationsContainer"
import { UsersList } from "../components/UsersList"
import { Chat } from "../components/Chat"
import { Button } from "../components/Button"
import "../styles/Home.css"
import {disconnectWebsocket} from "../utils/disconnectWebsocket" 
import {CHAT_WEBSOCKET} from "../utils/constants"
import * as states from "../store"
// import { destroy } from 'zustand';



/**
 * Pagina principal del sitio
 */
export function Home() {
    const navigate                      = useNavigate()
    useEffect(()=>{
        return ()=>{
            // esto se ejecutara cuando el componente sea desmontado
            resetSomeGlobalStates(["useClickedUser", "useLastClickedUser", "useMessagesHistorial"])
            disconnectWebsocket(CHAT_WEBSOCKET)
        }
    }, [])
    const resetSomeGlobalStates = (statesList)=>{
        Object.keys(states).forEach(key=>{
            if (statesList.includes(key)){
                if (states[key].getState().reset){
                    states[key].getState().reset()
                }
            }
        })
    }
    if (!userIsAuthenticated()){
        return <UserNotLogged msg="No puedes acceder al Home si aun no has iniciado sesión o no tienes cuenta"/>
    } else {
        return (
            <div className="centered-container">
                <div className="home-container">
                    <Header msg="En el home"/>
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
            </div>
        )
    }
}