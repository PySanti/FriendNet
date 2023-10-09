import {useState, useEffect, useRef} from "react"
import { MessagesContainer } from "./MessagesContainer"
import { ChattingUserHeader } from "./ChatingUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {CHAT_WEBSOCKET} from "../utils/constants"
import {ChatWSGroupCreationMsg}         from "../utils/ChatWSGroupCreationMsg"
import {ChatWSGroupName}                from "../utils/ChatWSGroupName"
import {ChatWSInitialize}               from "../utils/ChatWSInitialize"
import {useClickedUser}                 from "../store/clickedUserStore"
import {getUserDataFromLocalStorage}    from "../utils/getUserDataFromLocalStorage"
import {useMessagesHistorial} from "../store/messagesHistorialStore"
import {useLoadingState} from "../store/loadingStateStore"
import {useNotifications} from "../store/notificationsStore"
import { getRelatedNotification } from "../utils/getRelatedNotification"
import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"
import {useNavigate} from "react-router-dom" 
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeSecuredApi} from "../utils/executeSecuredApi"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_UNEXPECTED_ERROR_MESSAGE, BASE_UNEXPECTED_ERROR_LOG, BASE_RATE_LIMIT_BLOCK_RESPONSE} from "../utils/constants"
import {enterChatAPI} from "../api/enterChat.api"
import {updateMessagesHistorial} from "../utils/updateMessagesHistorial"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import {useLastClickedUser} from "../store/lastClickedUserStore"

/**
 * 
 * Contenedor unicamente del chat entre el session user y el clicked usee\
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
        const response = await executeSecuredApi(async ()=>{
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
                successfullyLoaded()
            }else if (response.status == 403){
                setLoadingState(BASE_RATE_LIMIT_BLOCK_RESPONSE)
            } else if (response.status == 400){
                setLoadingState({
                    "user_not_found"                    : "Tuvimos problemas para encontrar a ese usuario!",
                    "error_while_checking_is_online"    : 'Error comprobando si el usuario esta en linea!',
                    "error_while_getting_messages"      : 'Error buscando mensajes!',
                    "error_while_deleting_notification" : 'Error borrando notificacion !'
                }[response.data.error])
            }  else if (response == BASE_FALLEN_SERVER_ERROR_MSG || response == BASE_UNEXPECTED_ERROR_MESSAGE){
                setLoadingState({
                    BASE_FALLEN_SERVER_ERROR_MSG : BASE_FALLEN_SERVER_LOG,
                    BASE_UNEXPECTED_ERROR_MESSAGE : BASE_UNEXPECTED_ERROR_LOG
                }[response])
            } else {
                setLoadingState(BASE_UNEXPECTED_ERROR_LOG)
            }
        }
    }
    useEffect(()=>{
        if (diferentUserHasBeenClicked(lastClickedUser, clickedUser)){
            if (!CHAT_WEBSOCKET.current){
                ChatWSInitialize(userData.id, clickedUser.id)
            } else {
                CHAT_WEBSOCKET.current.send(ChatWSGroupCreationMsg(ChatWSGroupName(userData.id, clickedUser.id)))
            }
            (async function() {
                messagesHistorialPage.current = 1
                noMoreMessages.current = false
                clickedUser.is_online = false
                setClickedUser(clickedUser)
                await enterChatHandler()
            })();
        }
    }, [clickedUser])
    useEffect(()=>{
        if (CHAT_WEBSOCKET.current){
            CHAT_WEBSOCKET.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                const dataType = data.type
                console.log('Recibiendo datos a traves del websocket de mensajes')
                console.log(data)
                delete data.type
                if (dataType === "message_broadcast"){
                    if (Number(data.parent_id) !== Number(userData.id)){
                        setMessagesHistorial([...messagesHistorial, data])
                    }
                } else if (dataType === "connection_inform"){
                    if (data['user_id'] == clickedUser.id){
                        clickedUser.is_online = data['connected']
                        setClickedUser(clickedUser)
                    }
                }
            };
        }
    }, [messagesHistorial])


    return (
        <div className="chat-container">
            {clickedUser  && <ChattingUserHeader/>}
            <MessagesContainer newMsg={newMsg}  messagesHistorialPage={messagesHistorialPage} noMoreMessages={noMoreMessages}/>
            {clickedUser && <MsgSendingInput onMsgSending={(newMsg)=>setNewMsg(newMsg)}/>}
        </div>
    )
}