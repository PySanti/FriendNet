import { useForm } from "react-hook-form"
import { BASE_MESSAGE_MAX_LENGTH } from "../main"
import { Form } from "./Form"
import {PropTypes} from "prop-types"

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
        <Form buttonMsg="Enviar" onSubmitFunction={onSubmit} withSubmitButton>
            <input type="text" maxLength={BASE_MESSAGE_MAX_LENGTH} {...register("msg")}/>
        </Form>
    )
}

MsgSendingInput.propTypes = {
    onMsgSending : PropTypes.func
}
