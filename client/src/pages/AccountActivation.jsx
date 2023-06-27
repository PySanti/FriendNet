// components
import {  useLocation, useNavigate} from "react-router-dom"
import { Header } from "../components/Header"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
// api's
import { activateUserAPI } from "../api/activateUser.api"
import { FormField } from "../components/FormField"
import { sendActivationEmailAPI } from "../api/sendActivationEmail.api"
import { generateActivationCode } from "../tools/generateActivationCode"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserLogged } from "./UserLogged"
import { UserNotLogged } from "./UserNotLogged"

export function AccountActivation() {
    let [userActivated, setUserActivated]               = useState(false)
    let [realActivationCode, setRealActivationCode]     = useState(null)
    let [failedErrorCode, setFailedErrorCode]           = useState(false)  
    let [unExpectedError, setUnExpectedError]           = useState(null)
    const props                                         = useLocation().state
    const navigate                                      = useNavigate()

    const sendMail = async (activation_code)=>{
        // const response = await sendActivationEmailAPI(props.userEmail, props.username, activation_code)
        console.log(activation_code)
        console.log('enviando correo de activacion')
    }
    const {register, handleSubmit, formState:{errors}}  = useForm()
    const onSubmit = handleSubmit(async (data)=>{
        if (Number(data.activation_code) === Number(realActivationCode)){
            try {
                const response = await activateUserAPI(props.userId)
                setUserActivated(true)
            } catch(error){
                const errorMsg = error.response.data.error
                if (errorMsg === "serializer_error"){
                    setUnExpectedError("Error en el serializador de la api!")
                } else {
                    setUnExpectedError("Error inesperado en el servidor al activar usuario!")
                }
            }
        } else {
            setFailedErrorCode(true)
        }
    })

    useEffect(()=>{
        // se enviara el correo de activacion la primera vez que se monte el componente
        const activation_code = generateActivationCode()
        sendMail(activation_code)
        setRealActivationCode(activation_code)
    }, [])

    useEffect(()=>{
        if (userActivated){
            navigate("/login/")
        } 
    }, [userActivated])
    if (userIsAuthenticated()){ // comprobaciones para cuando se ejecute la url directamente 
        return <UserLogged/>
    } else if (!props){
        return <UserNotLogged/>
    } else{
        return (
                <>
                    <Header/>
                    <div>
                        <h1>
                            Activa tu cuenta antes de continuar !
                        </h1>
                        <form onSubmit={onSubmit}>
                            {unExpectedError && unExpectedError}
                            {failedErrorCode && "Error, codigo invalido!"}
                            <FormField label="Codigo " errors={errors.activation_code && errors.activation_code.message}>
                                <input 
                                    type="text"
                                    maxLength={6}
                                    minLength={1}
                                    name="activation_code"
                                    id="activation_code"
                                    {...register("activation_code", {
                                        required : {
                                            value : true,
                                            message : "Por favor ingresa un código de activación"
                                        },
                                        pattern : {
                                            value : /^-?\d+$/,
                                            message : "Por favor, ingresa un codigo valido"
                                        },
                                        minLength : {
                                            value : 6,
                                            message : 'Debes ingresar al menos 6 caracteres',
                                        }
                                        })}
                                />
                            <button type="submit">enviar</button>
                            </FormField>
                        </form>
                    </div>
                </>
            )
    }
}
