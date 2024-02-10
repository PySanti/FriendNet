import {toast} from "sonner"
import {v4} from "uuid"
import {EmailField} from "../components/EmailField"
import {Form} from "../components/Form"
import {Header} from "../components/Header"
import { useForm } from "react-hook-form";
import {BASE_EMAIL_CONSTRAINTS, BASE_SECURITY_CODE_CONSTRAINTS, BASE_PASSWORD_CONSTRAINTS} from "../utils/constants"
import {toastedApiCall} from "../utils/toastedApiCall"
import {generateSendSecurityCodeAPI} from "../api/generateSendSecurityCode.api"
import {useNavigate} from "react-router-dom"
import {Button} from "../components/Button"
import { useState} from "react"
import {CodeField} from "../components/CodeField"
import {PasswordField} from "../components/PasswordField"
import {recoveryPasswordAPI} from "../api/recoveryPassword.api"
import {userIsAuthenticated} from "../utils/userIsAuthenticated"
import {UserLogged} from "../pages/UserLogged"
import {checkSecurityCodeAPI} from "../api/checkSecurityCode.api"

export function ForgotPasswordPage(){
    let [emailSended, setEmailSended] = useState(false)
    let [codeEntered, setCodeEntered] = useState(false)
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}}  = useForm()
    const handleCodeInput = async (data)=>{
        let response = await toastedApiCall(async ()=>{
            return await checkSecurityCodeAPI(data.email, data.code)
        })
        if (response){
            if (response.status == 200){
                toast.success("Código valido, modifica tu contraseña")
                setCodeEntered(true)
            } else {
                if (response.data.error == "invalid_security_code"){
                    toast.error('¡ Código invalido !')
                } else {
                    toast.error('¡ Hubo un error inesperado revisando el código !')
                }
            }
        }
    }
    const handleEmailInput = async (data)=>{
        let response = await toastedApiCall(async ()=>{
            return await generateSendSecurityCodeAPI(data.email, `Recupera tu cuenta`)
        }, navigate, 'Buscando usuario')
        if (response){
            if (response.status == 200){
                toast.success('Correo de recuperación enviado')
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
            return await recoveryPasswordAPI(data.email, data.newPwd, data.code)
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
    if (userIsAuthenticated()){
        return <UserLogged/>
    } else {
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
                                    onSubmitFunction={!emailSended? handleSubmit((data)=>{handleEmailInput(data)}) : handleSubmit((data)=>{handleCodeInput(data)})} 
                                    buttonMsg={!emailSended ? "Buscar" : "Recuperar"} 
                                    buttonsList={[<Button key={v4()} onClickFunction={()=>navigate("/login/")} back/>]}>
                                    {!emailSended ?
                                        <EmailField errors={errors.email && errors.email.message} registerObject={register("email", BASE_EMAIL_CONSTRAINTS)}/>
                                        :
                                        <CodeField errors={errors.code && errors.code.message} registerObject={register("code", BASE_SECURITY_CODE_CONSTRAINTS)}/>
                                    }
                                </Form>
                        }
                    </div>
                </div>
        )
    }
}