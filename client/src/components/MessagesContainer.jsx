import {PropTypes} from "prop-types"
import { Message } from "./Message"
import "../styles/MessagesContainer.css"
import { v4 } from "uuid"
import { useEffect, useState, useRef } from "react"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_UNEXPECTED_ERROR_MESSAGE, BASE_UNEXPECTED_ERROR_LOG} from "../utils/constants"
import { getJWTFromLocalStorage } from "../utils/getJWTFromLocalStorage"
import { useNavigate } from "react-router-dom"
import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"
import { sendMsgAPI } from "../api/sendMsg.api"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {NotificationsWSNotificationBroadcastingMsg} from "../utils/NotificationsWSNotificationBroadcastingMsg"
import {executeSecuredApi} from "../utils/executeSecuredApi"

/**
 * Componente encargado de renderizar y mantener la lista de mensajes 
 * @param {Number} sessionUserId  id de usuario de sesion
 * @param {Object} clickedUser 
 * @param {Object} lastClickedUser  
 * @param {Object} loadingStateHandlers objecto que contendra los objetos necesarios para mantener los estados de carga
 * @param {Object} newMsg state creado para cuando se envia un mensaje nuevo
 * @param {Array} messagesHistorial
 * @param {Function} setMessagesHistorial
 * @param {Object} newMsgSendedSetter objeto retornado por la api cuando el mensaje fue enviado exitosamente
 * @param {Object} groupFull
 * @param {Object} messagesHistorialPage
 * @param {Function} loadMessagesFunc
 */
export function MessagesContainer({
        sessionUserId, 
        clickedUser, 
        lastClickedUser, 
        loadingStateHandlers,
        newMsg, 
        messagesHistorial, 
        setMessagesHistorial,
        newMsgSendedSetter, 
        groupFull, 
        messagesHistorialPage,
        loadMessagesFunc }){
    const containerRef                                                  = useRef(null)
    const navigate                                                      = useNavigate()
    let noMoreMessages                                                  = useRef(false)
    let { setLoadingState,startLoading,  successfullyLoaded}            = loadingStateHandlers
    let [newNotificationId, setNewNotificationId]                       = useState(null)


    const sendMsg = async (data)=>{
        startLoading()
        const response = await executeSecuredApi(async ()=>{
            return await sendMsgAPI(clickedUser.id, data.msg, !groupFull, getJWTFromLocalStorage().access)
        }, navigate)
        if (response){
            if (response.status == 200){
                newMsgSendedSetter(response.data.sended_msg)
                setNewNotificationId(response.data.sended_notification_id)
                setMessagesHistorial([...messagesHistorial, response.data.sended_msg])
                successfullyLoaded()
            } else if (response.status == 400){
                setLoadingState('Error inesperado en respuesta del servidor, no se pudo enviar el mensaje !')
            } else if (response == BASE_FALLEN_SERVER_ERROR_MSG || response == BASE_UNEXPECTED_ERROR_MESSAGE){
                setLoadingState({
                    BASE_FALLEN_SERVER_ERROR_MSG : BASE_FALLEN_SERVER_LOG,
                    BASE_UNEXPECTED_ERROR_MESSAGE : BASE_UNEXPECTED_ERROR_LOG
                }[response])
            }
        }
    }
    const formatingFunction = (msg)=>{
        return <Message key={v4()} content={msg.content} sessionUserMsg={sessionUserId === msg.parent_id}/>
    }
    const scrollHandler = async (e)=>{
        if (e.target.scrollTop <= 0){
            messagesHistorialPage.current += 1
            if (!noMoreMessages.current){
                await loadMessagesFunc()
            }
        }
    }

    useEffect(()=>{
        if (newNotificationId){
            NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSNotificationBroadcastingMsg(newNotificationId, clickedUser.id, sessionUserId))
            console.log('Id de la nueva notificacion ', newNotificationId)
        }
    }, [newNotificationId])
    useEffect(()=>{
        if (containerRef.current){
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messagesHistorial])
    useEffect(()=>{
        if (diferentUserHasBeenClicked(lastClickedUser, clickedUser)){
            setMessagesHistorial([])
            messagesHistorialPage.current = 1
            noMoreMessages.current = false
        }
    }, [clickedUser])
    useEffect(()=>{
        if (newMsg){
            sendMsg(newMsg)
        }
    }, [newMsg])
    return (
        <div className="messages-container">
            {messagesHistorial.length !== 0 ?  
                <div className="messages-list-container" ref={containerRef} onScroll={scrollHandler}>
                    {messagesHistorial.map(formatingFunction)}
                </div>
                : 
                <h3 className="messages-container__title">No hay mensajes :(</h3>
            }
        </div>
    )
}

MessagesContainer.propTypes = {
    sessionUserId : PropTypes.number.isRequired,
    clickedUser : PropTypes.object,
    lastClickedUser : PropTypes.object,
    loadingStateHandlers : PropTypes.object.isRequired,
    newMsg : PropTypes.object,
    messagesHistorial : PropTypes.array,
    setMessagesHistorial : PropTypes.func,
    newMsgSendedSetter : PropTypes.func.isRequired,
    groupFull : PropTypes.bool.isRequired,
    messagesHistorialPage : PropTypes.object.isRequired,
    loadMessagesFunc : PropTypes.func.isRequired
}
