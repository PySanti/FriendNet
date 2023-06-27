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

export function AccountActivation() {
    let [userActivated, setUserActivated]               = useState(false)
    let [realActivationCode, setRealActivationCode]     = useState(null)
    let [failedErrorCode, setFailedErrorCode]           = useState(false)  
    let [unExpectedError, setUnExpectedError]           = useState(null)
    const props                                         = useLocation().state
    const navigate                                      = useNavigate()
    if (!props){
        console.warn('Atencion: el componente AccountActivation no esta recibiendo props')
    }
    const sendMail = async (activation_code)=>{
        // const response = await sendActivationEmailAPI(props.userEmail, props.username, activation_code)
        console.log(activation_code)
        console.log('enviando correo de activacion')
    }
    const {register, handleSubmit, formState:{errors}}  = useForm()
    const onSubmit = handleSubmit(async (data)=>{
        if (Number(data.activation_code) === Number(realActivationCode)){
            try {
                const response = await activateUserAPI(realActivationCode)
                setUserActivated(true)
            } catch(error){
                const errorMsg = error.response.data.error
                if (errorMsg === "serializer_error"){
                    setUnExpectedError("Error en el serializador de la api!")
                } else {
                    setUnExpectedError("Error inesperado en el servidor al crear usuario!")
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
    return (
        <>
            <Header/>
            <div>
                <h1>
                    Activa tu cuenta antes de continuar !
                </h1>
                <form onSubmit={onSubmit}>
                    {unExpectedError && unExpectedError}
                    <FormField label="Codigo " errors={errors.activation_code && errors.activation_code.message || failedErrorCode && "Error, codigo invalido!"}>
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
