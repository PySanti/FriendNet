import {toast} from "sonner"
import {v4} from "uuid"
import {EmailField} from "../components/EmailField"
import {Form} from "../components/Form"
import {Header} from "../components/Header"
import { useForm } from "react-hook-form";
import {BASE_EMAIL_CONSTRAINTS, BASE_ACTIVATION_CODE_CONSTRAINTS, BASE_PASSWORD_CONSTRAINTS} from "../utils/constants"
import {toastedApiCall} from "../utils/toastedApiCall"
import {sendEmailAPI} from "../api/sendEmail.api"
import {useNavigate} from "react-router-dom"
import {Button} from "../components/Button"
import {useRef, useState} from "react"
import {CodeField} from "../components/CodeField"
import {generateActivationCode} from "../utils/generateActivationCode"
import {PasswordField} from "../components/PasswordField"
import {recoveryPasswordAPI} from "../api/recoveryPassword.api"

export function ForgotPasswordPage(){
    let [emailSended, setEmailSended] = useState(false)
    let [codeEntered, setCodeEntered] = useState(false)
    const realRecoveryCode = useRef(generateActivationCode())
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}}  = useForm()
    const handleCodeInput = async (data)=>{
        if (realRecoveryCode.current == data.code){
            toast.success("Código valido, modifica tu contraseña")
            setCodeEntered(true)
        } else {
            toast.error('¡ Código invalido !')
        }
    }
    const handleUsernameInput = async (data)=>{
        let response = await toastedApiCall(async ()=>{
            return await sendEmailAPI(data.email, realRecoveryCode.current, "Recupera tu cuenta")
        }, navigate, 'Buscando usuario')
        if (response){
            if (response.status == 200){
                toast.success('Correo de recuperación enviado')
                console.log(realRecoveryCode.current)
                setEmailSended(true)
            } else {
                if (response.data.error == "user_not_exists"){
                    toast.error('¡ Correo inexistente en la base de datos !')
                } else {
                    toast.error('¡ Hubo un error inesperado buscando usuario !')
                }
            }
        }
    }
    const handleNewPasswordInput = async (data)=>{
        let response = await toastedApiCall(async ()=>{
            return await recoveryPasswordAPI(data.email, data.newPwd)
        }, navigate, 'Modificando contraseña')
        if (response){
            if (response.status == 200){
                toast.success("Contraseña modificada exitosamente")
                navigate("/login/")
            } else {
                toast.error('¡ Hubo un error inesperado modificando la contraseña !')
            }
        }
    }
    return (
            <div className="centered-container">
                <div className="login-container">
                    <Header msg="Recuperando cuenta"/>
                    {
                        codeEntered ?
                            <Form
                                onSubmitFunction={handleSubmit((data)=>{handleNewPasswordInput(data)})} 
                                buttonMsg="Modificar contraseña"
                                buttonsList={[<Button key={v4()} onClickFunction={()=>navigate("/login/")} back/>]}
                            >
                                <PasswordField label="Nueva contraseña" errors={errors.newPwd && errors.newPwd.message} registerObject={register("newPwd", BASE_PASSWORD_CONSTRAINTS)}/>
                            </Form>
                        :
                            <Form 
                                onSubmitFunction={!emailSended? handleSubmit((data)=>{handleUsernameInput(data)}) : handleSubmit((data)=>{handleCodeInput(data)})} 
                                buttonMsg={!emailSended ? "Buscar" : "Recuperar"} 
                                buttonsList={[<Button key={v4()} onClickFunction={()=>navigate("/login/")} back/>]}>
                                {!emailSended ?
                                    <EmailField errors={errors.email && errors.email.message} registerObject={register("email", BASE_EMAIL_CONSTRAINTS)}/>
                                    :
                                    <CodeField errors={errors.code && errors.code.message} registerObject={register("code", BASE_ACTIVATION_CODE_CONSTRAINTS)}/>
                                }
                            </Form>
                    }

                </div>
            </div>
    )
}