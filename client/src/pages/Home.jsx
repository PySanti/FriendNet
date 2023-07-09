import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
import { getUsersListAPI } from "../api/getUsersList.api"
import { FormatedUsersList } from "../components/FormatedUsersList"
import { SubmitStateContext } from "../context/SubmitStateContext"
import "../styles/home-styles.css"
import { getChatBetweenAPI } from "../api/getChatBetween.api"
import { Chat } from "../components/Chat"
import { Loader } from "../components/Loader"
import { UnExpectedError } from "../components/UnExpectedError"
import { sendMsgAPI } from "../api/sendMsg.api"
/**
 * Pagina principal del sitio
 */
export function Home() {
    let {loadingState, unExpectedError, handleUnExpectedError, startLoading, nullSubmitStates, successfullyLoaded} = useContext(SubmitStateContext)
    let [messagesHistorial, setMessagesHistorial] = useState(null)
    let [receiverId, setReceiverId] = useState(null)
    const {user, logoutUser} = useContext(AuthContext)
    const navigate = useNavigate()
    let [userList, setUserList] = useState(false)
    const onMsgSending = async (data)=>{
        startLoading()
        try {
            console.log('enviando mensaje')
            const response = await sendMsgAPI(receiverId, user.user_id, data.msg)
            successfullyLoaded()
        } catch(error){
            console.log(error)
        }
    }
    const onUserButtonClick = async (clicked_user_id)=>{
        setReceiverId(clicked_user_id)
        startLoading()
        try{
            const response = await getChatBetweenAPI(user.user_id, clicked_user_id)
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
                    <div className="interface-container">
                        <FormatedUsersList usersList={userList} onClickEvent={onUserButtonClick}/>
                        <Chat messages={messagesHistorial} session_user_id={user.user_id} onMsgSending={onMsgSending}/>
                    </div>
                }
                <button onClick={logoutUser}>Salir</button>
                <button onClick={()=>{setGoToProfile(true)}}>Perfil</button>
            </>
        )
    }
}