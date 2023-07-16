// components
import {  useLocation, useNavigate} from "react-router-dom"
import { Header } from "../components/Header"
import { useForm } from "react-hook-form"
import { useContext, useEffect, useState } from "react"
// api's
import { activateUserAPI } from "../api/activateUser.api"
import { FormField } from "../components/FormField"
import { generateActivationCode } from "../tools/generateActivationCode"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserLogged } from "./UserLogged"
import { UserNotLogged } from "./UserNotLogged"
import { Loader } from "../components/Loader"
import { Form } from "../components/Form"
import { LoadingContext } from "../context/LoadingContext"
import { Button } from "../components/Button"

/**
 * Pagina creada para llevar activacion de cuenta
 */
export function AccountActivation() {
    let {loadingState, setLoadingState, successfullyLoaded} = useContext(LoadingContext)
    let [userActivated, setUserActivated]               = useState(false)
    let [realActivationCode, setRealActivationCode]     = useState(null)
    const props                                         = useLocation().state
    const navigate                                      = useNavigate()
    const {register, handleSubmit, formState:{errors}}  = useForm()

    const sendMail = async (activation_code)=>{
        // const response = await sendActivationEmailAPI(props.userEmail, props.username, activation_code)
        console.log(activation_code)
    }
    const onSubmit = handleSubmit(async (data)=>{
        if (Number(data.activation_code) === Number(realActivationCode)){
            setLoadingState(true)
            try {
                console.log('activando')
                await activateUserAPI(props.userId)
                setUserActivated(true)
                successfullyLoaded()
            } catch(error){
                setLoadingState("Error inesperado en el servidor al activar usuario!")
            }
        } else {
            setLoadingState("Codigo invalido!")
        }
    })

    useEffect(()=>{
        setLoadingState(false)
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
                    <Header msg="Activa tu cuenta antes de continuar"/>
                    <Loader msg={loadingState}/>
                    <Form onSubmitFunction={onSubmit} buttonMsg="Enviar">
                        <FormField label="Codigo " errors={errors.activation_code && errors.activation_code.message}>
                            <input type="text"maxLength={6}minLength={1}name="activation_code"id="activation_code"{...register("activation_code", {    required : {        value : true,        message : "Por favor ingresa un código de activación"    },    pattern : {        value : /^-?\d+$/,        message : "Por favor, ingresa un codigo valido"    },    minLength : {        value : 6,        message : 'Debes ingresar al menos 6 caracteres',    }    })}/>
                        </FormField>
                    </Form>
                </>
            )
    }
}
