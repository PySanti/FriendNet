import {PropTypes} from "prop-types"
import { Message } from "./Message"
import "../styles/MessagesContainer.css"
import { v4 } from "uuid"
import { useEffect, useState, useRef } from "react"
import { getMessagesHistorialAPI } from "../api/getMessagesHistorial.api"
import { validateJWT } from "../utils/validateJWT"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_JWT_ERROR_LOG, BASE_LOGIN_REQUIRED_ERROR_MSG} from "../utils/constants"
import { getJWTFromLocalStorage } from "../utils/getJWTFromLocalStorage"
import { useNavigate } from "react-router-dom"
import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"
import {redirectExpiredUser} from "../utils/redirectExpiredUser"
import { sendMsgAPI } from "../api/sendMsg.api"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {NotificationsWSNotificationBroadcastingMsg} from "../utils/NotificationsWSNotificationBroadcastingMsg"


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
 */
export function MessagesContainer({sessionUserId, clickedUser, lastClickedUser, loadingStateHandlers, newMsg, messagesHistorial, setMessagesHistorial, newMsgSendedSetter, groupFull }){
    const containerRef                                                  = useRef(null)
    const navigate                                                      = useNavigate()
    let messagesHistorialPage                                           = useRef(1)
    let noMoreMessages                                                  = useRef(false)
    let { setLoadingState,startLoading,  successfullyLoaded}            = loadingStateHandlers
    let [newNotificationId, setNewNotificationId]                       = useState(null)


    const sendMsg = async (data)=>{
        startLoading()
        const successValidating = await validateJWT()
        if (successValidating === true){
            try {
                const response = await sendMsgAPI(clickedUser.id, data.msg, groupFull, getJWTFromLocalStorage().access)
                newMsgSendedSetter(response.data.sended_msg)
                setNewNotificationId(response.data.sended_notification_id)
                setMessagesHistorial([...messagesHistorial, response.data.sended_msg])
                successfullyLoaded()
            } catch(error){
                setLoadingState(error.message === BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : 'Error inesperado en respuesta del servidor, no se pudo enviar el mensaje !')
            }
        } else {
            if (successValidating === BASE_LOGIN_REQUIRED_ERROR_MSG){
                redirectExpiredUser(navigate)
            } else {
                setLoadingState(BASE_JWT_ERROR_LOG)
            }
        }
    }
    const formatingFunction = (msg)=>{
        return <Message key={v4()} content={msg.content} sessionUserMsg={sessionUserId === msg.parent_id}/>
    }
    const updateMessagesHistorial = (newMessages) =>{
        if (messagesHistorialPage.current === 1){
            setMessagesHistorial(newMessages)
        } else {
            messagesHistorial.unshift(...newMessages)
            setMessagesHistorial(messagesHistorial)
        }
    }
    const loadMessages = async ()=>{
        startLoading()
        const successValidating = await validateJWT()
        if (successValidating === true){
            try{
                const response = await getMessagesHistorialAPI(clickedUser.id, getJWTFromLocalStorage().access, messagesHistorialPage.current)
                updateMessagesHistorial(response.data !== "no_messages_between" ? response.data.messages_hist : [])
                successfullyLoaded()
            } catch(error){
                if (error.message === BASE_FALLEN_SERVER_ERROR_MSG){
                    setLoadingState(BASE_FALLEN_SERVER_LOG)
                } else {
                    if (error.response.data.error === "no_more_pages"){
                        noMoreMessages.current = true
                        successfullyLoaded()
                    } else {
                        setLoadingState('Error inesperado buscando chat!')
                    }
                }
            }
        } else {
            if (successValidating === BASE_LOGIN_REQUIRED_ERROR_MSG){
                redirectExpiredUser(navigate)
            } else {
                setLoadingState(BASE_JWT_ERROR_LOG)
            }
        }
    }
    const scrollHandler = (e)=>{
        if (e.target.scrollTop <= 0){
            messagesHistorialPage.current += 1
            if (!noMoreMessages.current){
                loadMessages()
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
            loadMessages()
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
    groupFull : PropTypes.bool.isRequired
}
