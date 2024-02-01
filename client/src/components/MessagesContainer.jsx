import {toast} from "sonner"
import {PropTypes} from "prop-types"
import { Message } from "./Message"
import "../styles/MessagesContainer.css"
import { v4 } from "uuid"
import { useEffect, useRef, useState} from "react"
import { getJWTFromLocalStorage } from "../utils/getJWTFromLocalStorage"
import { useNavigate } from "react-router-dom"
import { sendMsgAPI } from "../api/sendMsg.api"
import {executeApi} from "../utils/executeApi"
import {getMessagesHistorialAPI} from "../api/getMessagesHistorial.api"
import {updateMessagesHistorial} from "../utils/updateMessagesHistorial"
import {useClickedUser} from "../store"
import {useMessagesHistorial} from "../store"
import {BASE_MESSAGES_LIST_PAGE_SIZE} from "../utils/constants"
import {nonToastedApiCall} from "../utils/nonToastedApiCall"
/**
 * Componente encargado de renderizar y mantener la lista de mensajes 
 * @param {Object} newMsg state creado para cuando se envia un mensaje nuevo
 * @param {Object} messagesHistorialPage
 * @param {Object} noMoreMessages  
*/
export function MessagesContainer({newMsg, messagesHistorialPage,noMoreMessages}){
    const containerRef                                                  = useRef(null)
    const navigate                                                      = useNavigate()
    const clickedUser                                                   = useClickedUser((state)=>(state.clickedUser))
    const [messagesHistorial, setMessagesHistorial]                     = useMessagesHistorial((state)=>([state.messagesHistorial, state.setMessagesHistorial]))
    let [oldScrollHeight, setOldScrollHeight]                           = useState(false)

    const loadMessages = async ()=>{
        const response = await executeApi(async ()=>{
            return await getMessagesHistorialAPI(clickedUser.id, getJWTFromLocalStorage().access, messagesHistorialPage.current)
        }, navigate)
        if (response){
            if (response.status == 200){
                setOldScrollHeight(containerRef.current.scrollHeight)
                updateMessagesHistorial(setMessagesHistorial, messagesHistorialPage, response.data !== "no_messages_between" ? response.data.messages_hist : [], messagesHistorial)
            } else if (response.status == 400){
                if (response.data.error == "no_more_pages"){
                    noMoreMessages.current = true
                } else if (response.data.error == "error_while_getting_messages"){
                    toast.error('¡ Ha habido un error cargando los mensajes !')
                }
            } else {
                toast.error('¡ Error inesperado cargando los mensajes !')
            }
        }
    }
    const sendMsg = async (data)=>{
        const response = await nonToastedApiCall(async ()=>{
            return await sendMsgAPI(clickedUser.id, data.msg, getJWTFromLocalStorage().access)
        }, navigate, 'Enviando mensaje, espere', 2000)
        if (response){
            if (response.status == 200){
                setMessagesHistorial([...messagesHistorial, response.data.sended_msg])
            } else {
                toast.error('¡ Error inesperado enviando el mensaje !')
            }
        }
    }
    const formatingFunction = (msg)=>{
        return <Message key={v4()} messageObj={msg}/>
    }
    const scrollHandler = async (e)=>{
        if (e.target.scrollTop <= 0){
            if (!noMoreMessages.current && messagesHistorial.length >= BASE_MESSAGES_LIST_PAGE_SIZE){  
                messagesHistorialPage.current += 1
                // la ultima condicion se pone para evitar que se llame a la api cuando no se ha scrolleado
                await loadMessages()
            }
        }
    }
    useEffect(()=>{
        if (containerRef.current){
            containerRef.current.scrollTop += containerRef.current.scrollHeight - oldScrollHeight
        }
    }, [oldScrollHeight])
    useEffect(()=>{
        if (containerRef.current && messagesHistorial.length <= BASE_MESSAGES_LIST_PAGE_SIZE){
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messagesHistorial])
    useEffect(()=>{
        if (newMsg){
            (async function(){
                await sendMsg(newMsg)
                containerRef.current.scrollTop = containerRef.current.scrollHeight
            })();
        }
    }, [newMsg])
    return (
        <div className="messages-container">
            {messagesHistorial.length !== 0 ?  
                <div className="messages-list-container" ref={containerRef} onScroll={scrollHandler}>
                    {messagesHistorial.map(formatingFunction)}
                </div>
                : 
                <h3 className="messages-container__title">
                    {clickedUser?
                        "No hay mensajes :("
                        :
                        "Selecciona un usuario para chatear"
                    }
                        </h3>
            }
        </div>
    )
}

MessagesContainer.propTypes = {
    newMsg : PropTypes.object,
    messagesHistorialPage : PropTypes.object.isRequired,
    noMoreMessages : PropTypes.object.isRequired
}
