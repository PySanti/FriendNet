import {useState, useEffect, useRef} from "react"
import { MessagesContainer } from "./MessagesContainer"
import { ChattingUserHeader } from "./ChatingUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {CHAT_WEBSOCKET} from "../utils/constants"
import {ChatWSGroupCreationMsg}         from "../utils/ChatWSGroupCreationMsg"
import {ChatWSInitialize}               from "../utils/ChatWSInitialize"
import {useClickedUser}                 from "../store"
import {getUserDataFromLocalStorage}    from "../utils/getUserDataFromLocalStorage"
import {useMessagesHistorial} from "../store"
import {useLoadingState} from "../store"
import {useNotifications} from "../store"
import { getRelatedNotification } from "../utils/getRelatedNotification"
import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"
import {useNavigate} from "react-router-dom" 
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeApi} from "../utils/executeApi"
import {enterChatAPI} from "../api/enterChat.api"
import {updateMessagesHistorial} from "../utils/updateMessagesHistorial"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import {useLastClickedUser} from "../store"

/**
 * 
 * Contenedor unicamente del chat entre el session user y el clicked user
*/
export function Chat(){
    let messagesHistorialPage                                               = useRef(1)
    let noMoreMessages                                                      = useRef(false)
    let [newMsg, setNewMsg]                                                 = useState(null)
    let [clickedUser, setClickedUser]                                       = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let [messagesHistorial, setMessagesHistorial]                           = useMessagesHistorial((state)=>([state.messagesHistorial, state.setMessagesHistorial]))
    let [notifications, setNotifications]                                   = useNotifications((state)=>([state.notifications, state.setNotifications]))
    let lastClickedUser                                                     = useLastClickedUser((state)=>(state.lastClickedUser))
    const [setLoadingState, startLoading, successfullyLoaded]               = useLoadingState((state)=>([state.setLoadingState, state.startLoading, state.successfullyLoaded]))
    const userData                                                          = getUserDataFromLocalStorage()
    const navigate                                                          = useNavigate()

    const enterChatHandler = async ()=>{
        const relatedNotification = getRelatedNotification(clickedUser.id, notifications)
        startLoading()
        const response = await executeApi(async ()=>{
            return await enterChatAPI(clickedUser.id, relatedNotification? relatedNotification.id : undefined, getJWTFromLocalStorage().access)
        }, navigate, setLoadingState)
        if (response){
            if (response.status == 200){
                updateMessagesHistorial(setMessagesHistorial, messagesHistorialPage, response.data.messages_hist!== "no_messages_between" ? response.data.messages_hist : [], messagesHistorial)
                clickedUser.is_online = response.data.is_online
                setClickedUser(clickedUser)
                if (relatedNotification && response.data.notification_deleted){
                    removeAndUpdateNotifications(relatedNotification, setNotifications)
                }
                successfullyLoaded()
            } else if (response.status == 400){
                const log = {
                    "user_not_found"                    : "Tuvimos problemas para encontrar a ese usuario!",
                    "error_while_checking_is_online"    : 'Error comprobando si el usuario esta en linea!',
                    "error_while_getting_messages"      : 'Error buscando mensajes!',
                    "error_while_deleting_notification" : 'Error borrando notificacion !'
                }[response.data.error]
                setLoadingState(log ? log : "Error inesperado entrando al chat !")
            } else{
                setLoadingState('Error inesperado entrando al chat !')
            }
        }
    }
    useEffect(()=>{
        if (diferentUserHasBeenClicked(lastClickedUser, clickedUser)){
            if (!CHAT_WEBSOCKET.current){
                ChatWSInitialize(clickedUser.id)
            } else {
                CHAT_WEBSOCKET.current.send(ChatWSGroupCreationMsg(clickedUser.id))
            }
            (async function() {
                messagesHistorialPage.current = 1
                noMoreMessages.current = false
                clickedUser.is_online = false
                clickedUser.is_typing = false
                setClickedUser(clickedUser)
                setMessagesHistorial([])
                await enterChatHandler()
            })();
        }
    }, [clickedUser])
    useEffect(()=>{
        if (CHAT_WEBSOCKET.current){
            CHAT_WEBSOCKET.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                console.log('Recibiendo datos a traves del websocket de mensajes')
                console.log(data)
                if (data.type === "message_broadcast"){
                    if (Number(data.value.parent_id) !== Number(userData.id)){
                        setMessagesHistorial([...messagesHistorial, data.value])
                    }
                } else if (data.type === "connection_inform"){
                    if (data.value.user_id == clickedUser.id){
                        clickedUser.is_online = data.value.connected
                        clickedUser.is_typing = !data.value.connected ? false : clickedUser.is_typing
                        setClickedUser(clickedUser)
                    }
                }
            };
        }
    }, [messagesHistorial, clickedUser])


    return (
        <div className="chat-container">
            {clickedUser  && <ChattingUserHeader/>}
            <MessagesContainer newMsg={newMsg}  messagesHistorialPage={messagesHistorialPage} noMoreMessages={noMoreMessages}/>
            {clickedUser && <MsgSendingInput onMsgSending={(newMsg)=>setNewMsg(newMsg)}/>}
        </div>
    )
}