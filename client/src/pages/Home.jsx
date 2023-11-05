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
import {useClickedUser} from "../store/clickedUserStore"
import {useMessagesHistorial} from "../store/messagesHistorialStore"
import {useLastClickedUser} from "../store/lastClickedUserStore"
import {useUsersList} from "../store/usersListStore"
import {useUsersIdList} from "../store/usersIdListStore"
/**
 * Pagina principal del sitio
 */
export function Home() {
    const navigate                      = useNavigate()
    let setClickedUser                  = useClickedUser((state)=>(state.setClickedUser))
    let setMessagesHistorial            = useMessagesHistorial((state)=>(state.setMessagesHistorial))
    let setLastClickedUser              = useLastClickedUser((state)=>(state.setLastClickedUser))
    let setUsersList                    = useUsersList((state)=>(state.setUsersList))
    let setUsersIdList                  = useUsersIdList((state)=>state.setUsersIdList)
    useEffect(()=>{
        return ()=>{
            // esto se ejecutara cuando el componente sea desmontado
            setClickedUser(null)
            setLastClickedUser(null)
            setMessagesHistorial([])
            setUsersIdList([])
            setUsersList([])
            disconnectWebsocket(CHAT_WEBSOCKET)
        }
    }, [])

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