import { useForm } from "react-hook-form"
import { BASE_MESSAGE_MAX_LENGTH } from "../main"

/**
 * Input creado para el envio de mensajes
 * @param 
 */
export function MsgSendingInput({onMsgSending}){
    let {register, handleSubmit} = useForm()
    const onSubmit = handleSubmit((data)=>{
        onMsgSending(data)
    })
    return (
        <form className="input-container" onSubmit={onSubmit}>
            <input type="text" maxLength={BASE_MESSAGE_MAX_LENGTH} {...register("msg")}/>
            <button type="submit">enviar</button>
        </form>
    )
}