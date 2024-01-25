import {useState, useEffect, useRef} from "react"
import { useForm } from "react-hook-form"
import { BASE_MESSAGE_MAX_LENGTH } from "../utils/constants"
import {PropTypes} from "prop-types"
import "../styles/MessageSendingInput.css"
import {NOTIFICATIONS_WEBSOCKET, BASE_USER_TYPING_LOCAL_STORAGE_ATTR} from "../utils/constants"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {useClickedUser} from "../store"
import {NotificationsWSTypingInformMsg} from "../utils/NotificationsWSTypingInformMsg"
/**
 * Input creado para el envio de mensajes
 * @param  {Function} onMsgSending funcion que se ejecutara cuando se envie un mensaje
 */
export function MsgSendingInput({onMsgSending}){
    let clickedUser                     = useClickedUser((state)=>state.clickedUser)
    let currentTimeoutNumber            = useRef(null); 
    let {register, handleSubmit, reset} = useForm()
    let [clickedUserWhenTyping, setClickedUserWhenTyping] = useState(null)
    const userData                      = getUserDataFromLocalStorage()
    const onSubmit                      = handleSubmit((data)=>{
        const new_msg = data.msg.trim()
        if (new_msg.length > 0){
            onMsgSending(data)
            reset()
        }
    })
    useEffect(()=>{
        if (NOTIFICATIONS_WEBSOCKET.current && userData && clickedUserWhenTyping){
            NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSTypingInformMsg(clickedUserWhenTyping.id, true))
            localStorage.setItem(BASE_USER_TYPING_LOCAL_STORAGE_ATTR, clickedUserWhenTyping.id)
        }
    }, [clickedUserWhenTyping])
    useEffect(()=>{
        reset()
    }, [clickedUser])
    const handleMsgSendingInput = (e)=>{
        setClickedUserWhenTyping(clickedUser)
        if (currentTimeoutNumber.current){
            clearTimeout(currentTimeoutNumber.current)
        }
        currentTimeoutNumber.current = (setTimeout(() => {
            setClickedUserWhenTyping(null)
            /**
             * Recordar que en este punto, llamamos a la funcion desde aca,
             * para evitar errores cuando se desmonte la pagina por entrar al profile por ejemplo
            */
            if (NOTIFICATIONS_WEBSOCKET.current){
                NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSTypingInformMsg(clickedUser.id, false))
                localStorage.setItem(BASE_USER_TYPING_LOCAL_STORAGE_ATTR, false)
            } 
        }, 600))
    }
    return (
        <div className="message-sending-input-container">
            <form onChange = {handleMsgSendingInput} className="message-sending-form" onSubmit={onSubmit}>
                <input 
                placeholder="Envíale un mensaje" 
                className="message-sending-input" 
                type="text" 
                maxLength={BASE_MESSAGE_MAX_LENGTH} 
                minLength={1} 
                {...register("msg")}/>
            </form>
        </div>
    )
}

MsgSendingInput.propTypes = {
    onMsgSending : PropTypes.func
}
