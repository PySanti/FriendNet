import { useForm } from "react-hook-form"
import { BASE_MESSAGE_MAX_LENGTH } from "../main"
import { Form } from "./Form"
import {PropTypes} from "prop-types"
import { Button } from "./Button"
import "../styles/MessageSendingInput.css"

/**
 * Input creado para el envio de mensajes
 * @param  {Function} onMsgSending funcion que se ejecutara cuando se envie un mensaje
 */
export function MsgSendingInput({onMsgSending}){
    let {register, handleSubmit} = useForm()
    const onSubmit = handleSubmit((data)=>{
        onMsgSending(data)
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
