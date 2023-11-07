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
import {useNotificationsIdsCached} from "../store/notificationsIdCachedStore"
import {useUsersListPage} from "../store/usersListPageStore"
import {useNoMoreUsers} from "../store/noMoreUsersStore"
import {useNotifications} from "../store/notificationsStore"
// import { destroy } from 'zustand';



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
    let setNotificationsIdsCached       = useNotificationsIdsCached((state)=>state.setNotificationsIdsCached)
    let setUsersListPage                = useUsersListPage((state)=>state.setUsersListPage)
    let setNoMoreUsers                  = useNoMoreUsers((state)=>state.setNoMoreUsers)
    let setNotifications                = useNotifications((state)=>state.setNotifications)
    useEffect(()=>{
        return ()=>{
            // esto se ejecutara cuando el componente sea desmontado
            setClickedUser(null)
            setLastClickedUser(null)
            setMessagesHistorial([])
            disconnectWebsocket(CHAT_WEBSOCKET)
        }
    }, [])
    const logoutHandler = ()=>{
        logoutUser(navigate)
        // Limpia todos los estados globales
        // destroy();
        setUsersListPage(1)
        setNoMoreUsers(false)
        setUsersIdList([])
        setNotifications([])
        setUsersList([])
        setNotificationsIdsCached(false)
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
                        <Button buttonText="Salir" onClickFunction={logoutHandler}/>
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