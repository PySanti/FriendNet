import {useRef} from "react"
import { useForm } from "react-hook-form"
import { BASE_MESSAGE_MAX_LENGTH } from "../utils/constants"
import {PropTypes} from "prop-types"
import "../styles/MessageSendingInput.css"

/**
 * Input creado para el envio de mensajes
 * @param  {Function} onMsgSending funcion que se ejecutara cuando se envie un mensaje
 */
export function MsgSendingInput({onMsgSending}){
    let {register, handleSubmit, reset} = useForm()
    const onSubmit = handleSubmit((data)=>{
        onMsgSending(data)
        reset()
    })
    return (
        <div className="message-sending-input-container">
            <form className="message-sending-form" onSubmit={onSubmit}>
                <input placeholder="Enviale un mensaje" className="message-sending-input" type="text" maxLength={BASE_MESSAGE_MAX_LENGTH} {...register("msg")}/>
            </form>
        </div>
    )
}

MsgSendingInput.propTypes = {
    onMsgSending : PropTypes.func
}
