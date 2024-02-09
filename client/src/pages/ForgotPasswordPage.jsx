import {toast} from "sonner"
import {v4} from "uuid"
import {EmailField} from "../components/EmailField"
import {Form} from "../components/Form"
import {Header} from "../components/Header"
import { useForm } from "react-hook-form";
import {BASE_EMAIL_CONSTRAINTS} from "../utils/constants"
import {toastedApiCall} from "../utils/toastedApiCall"
import {sendEmailAPI} from "../api/sendEmail.api"
import {useNavigate} from "react-router-dom"
import {Button} from "../components/Button"
import {useRef} from "react"
import {generateActivationCode} from "../utils/generateActivationCode"

export function ForgotPasswordPage(){
    const realRecoveryCode = useRef(generateActivationCode())
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}}  = useForm()
    const handleUsernameInput = async (data)=>{
        let response = await toastedApiCall(async ()=>{
            return await sendEmailAPI(data.email, realRecoveryCode.current, "Recupera tu cuenta")
        }, navigate, 'Buscando usuario')
        if (response){
            if (response.status == 200){
                toast.success('Correo de recuperación enviado')
            } else {
                if (response.data.error == "user_not_exists"){
                    toast.error('¡ Correo inexistente en la base de datos !')
                } else {
                    toast.error('¡ Hubo un error inesperado buscando usuario !')
                }
            }
        }
    }
    return (
            <div className="centered-container">
                <div className="login-container">
                    <Header msg="Recuperando cuenta"/>
                    <Form onSubmitFunction={handleSubmit((data)=>{handleUsernameInput(data)})} buttonMsg={"Buscar"} buttonsList={[<Button key={v4()} onClickFunction={()=>navigate("/login/")} back/>]}>
                        <EmailField errors={errors.email && errors.email.message} registerObject={register("email", BASE_EMAIL_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
    )
}