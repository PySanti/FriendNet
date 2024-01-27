import {toast} from "sonner"
import {useState, useEffect, useRef} from "react"
import { MessagesContainer } from "./MessagesContainer"
import { ClickedUserHeader } from "./ClickedUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {CHAT_WEBSOCKET} from "../utils/constants"
import {ChatWSGroupCreationMsg}         from "../utils/ChatWSGroupCreationMsg"
import {ChatWSInitialize}               from "../utils/ChatWSInitialize"
import {useClickedUser}                 from "../store"
import {getUserDataFromLocalStorage}    from "../utils/getUserDataFromLocalStorage"
import {useMessagesHistorial} from "../store"
import {useNotifications} from "../store"
import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"
import {useNavigate} from "react-router-dom" 
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeApi} from "../utils/executeApi"
import {enterChatAPI} from "../api/enterChat.api"
import {updateMessagesHistorial} from "../utils/updateMessagesHistorial"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import {useLastClickedUser, useTypingDB} from "../store"
import "../styles/Chat.css"

/**
 * 
 * Contenedor unicamente del chat entre el session user y el clicked user
*/
export function Chat(){
    let messagesHistorialPage                                               = useRef(1)
    let noMoreMessages                                                      = useRef(false)
    let [newMsg, setNewMsg]                                                 = useState(null)
    let [typingDB, setTypingDB]                                             = useTypingDB((state)=>([state.typingDB, state.setTypingDB]))
    let [clickedUser, setClickedUser]                                       = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let [messagesHistorial, setMessagesHistorial]                           = useMessagesHistorial((state)=>([state.messagesHistorial, state.setMessagesHistorial]))
    let [notifications, setNotifications]                                   = useNotifications((state)=>([state.notifications, state.setNotifications]))
    let lastClickedUser                                                     = useLastClickedUser((state)=>(state.lastClickedUser))
    const userData                                                          = getUserDataFromLocalStorage()
    const navigate                                                          = useNavigate()

    const enterChatHandler = async ()=>{
        const relatedNotification = notifications[clickedUser.id]
        const response = await executeApi(async ()=>{
            return await enterChatAPI(clickedUser.id, relatedNotification? relatedNotification.id : undefined, getJWTFromLocalStorage().access)
        }, navigate)
        if (response){
            if (response.status == 200){
                updateMessagesHistorial(setMessagesHistorial, messagesHistorialPage, response.data.messages_hist!== "no_messages_between" ? response.data.messages_hist : [], messagesHistorial)
                clickedUser.is_online = response.data.is_online
                setClickedUser(clickedUser)
                if (relatedNotification && response.data.notification_deleted){
                    removeAndUpdateNotifications(relatedNotification, setNotifications)
                }
            } else if (response.status == 400){
                const errors = {
                    "user_not_found"                    : "¡ Tuvimos problemas para encontrar a ese usuario !",
                    "error_while_checking_is_online"    : '¡ Error comprobando si el usuario esta en linea !',
                    "error_while_getting_messages"      : '¡ Error buscando mensajes !',
                    "error_while_deleting_notification" : '¡ Error borrando notificación !'
                }
                toast.error(errors[response.data.error]? errors[response.data.error] : "¡ Error inesperado entrando al chat !")
            } else{
                toast.error("¡ Error inesperado entrando al chat !")
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
                // revisar si estas dos lineas de arriba son necesarias realmente
                setClickedUser(clickedUser)
                await enterChatHandler()
            })();
        }
    }, [clickedUser])
    useEffect(()=>{
        if (CHAT_WEBSOCKET.current){
            CHAT_WEBSOCKET.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                if (data.type === "message_broadcast"){
                    if (Number(data.value.parent_id) !== Number(userData.id)){
                        setMessagesHistorial([...messagesHistorial, data.value])
                    }
                } else if (data.type === "connection_inform"){
                    if (data.value.user_id == clickedUser.id){
                        clickedUser.is_online = data.value.connected
                        if (!data.value.connected){
                            typingDB[clickedUser.id] =  false
                            setTypingDB(typingDB)
                        }
                        setClickedUser(clickedUser)
                    }
                }
            };
        }
    }, [messagesHistorial, clickedUser])


    return (
        <div className="chat-container">
            {clickedUser  && <ClickedUserHeader/>}
            <MessagesContainer newMsg={newMsg}  messagesHistorialPage={messagesHistorialPage} noMoreMessages={noMoreMessages}/>
            {clickedUser && <MsgSendingInput onMsgSending={(newMsg)=>setNewMsg(newMsg)}/>}
        </div>
    )
}