import { FormatedMessages } from "./FormatedMessages"
import { BASE_MESSAGE_MAX_LENGTH } from "../main"
import { useForm } from "react-hook-form"

export function Chat({messages, session_user_id, onMsgSending}){
    let {register, formState : {errors}, handleSubmit} = useForm()
    const onSubmit = handleSubmit((data)=>{
        onMsgSending(data)
    })
    return (
        <div className="chat-container">
            {!messages && <h3>{"no hay mensajes"}</h3>}
            {messages && <FormatedMessages messages={messages} session_user_id={session_user_id}/>}
            <form className="input-container" onSubmit={onSubmit}>
                <input type="text" maxLength={BASE_MESSAGE_MAX_LENGTH} {...register("msg")}/>
                <button type="submit">enviar</button>
            </form>
        </div>
    )
}