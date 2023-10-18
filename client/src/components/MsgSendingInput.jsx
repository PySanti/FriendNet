import {useState, useEffect} from "react"
import { useForm } from "react-hook-form"
import { BASE_MESSAGE_MAX_LENGTH } from "../utils/constants"
import {PropTypes} from "prop-types"
import "../styles/MessageSendingInput.css"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"

/**
 * Input creado para el envio de mensajes
 * @param  {Function} onMsgSending funcion que se ejecutara cuando se envie un mensaje
 */
export function MsgSendingInput({onMsgSending}){
    let [userIsWritting, setUserIsWritting] = useState(false)
    let [currentTimeoutNumber, setCurrentTimeoutNumber] = useState(null); 
    let {register, handleSubmit, reset} = useForm()
    const onSubmit = handleSubmit((data)=>{
        const new_msg = data.msg.trim()
        if (new_msg.length > 0){
            onMsgSending(data)
            reset()
        }
    })

    const handleMsgSendingInput = (e)=>{
        setUserIsWritting(true)
        if (currentTimeoutNumber){
            clearTimeout(currentTimeoutNumber)
        }
        setCurrentTimeoutNumber(setTimeout(() => {
            setUserIsWritting(false)
        }, 600))
    }
    return (
        <div className="message-sending-input-container">
            <form onChange = {handleMsgSendingInput} className="message-sending-form" onSubmit={onSubmit}>
                <input 
                placeholder="Enviale un mensaje" 
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
