import { useContext, useEffect, useState } from "react";

import { Header } from "../components/Header";
import { LoadingContext } from "../context/LoadingContext";
import {  useLocation, useNavigate} from "react-router-dom";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";
import { EmailField } from "../components/EmailField";
import { BASE_EMAIL_CONSTRAINTS } from "../utils/constants";
import { Form } from "../components/Form";
import { Loader } from "../components/Loader";
import { UserNotLogged } from "./UserNotLogged";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { changeEmailForActivationAPI } from "../api/changeEmailForActivation.api";

import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG} from "../utils/constants"

export function ChangeEmailForActivation(){
    let {loadingState, setLoadingState, successfullyLoaded, startLoading} = useContext(LoadingContext)
    let [goBack, setGoBack]                             = useState(false )
    let [emailChanged, setEmailChanged]                 = useState(false )
    const props                                         = useLocation().state
    const  navigate                                     = useNavigate()
    const {register, handleSubmit, formState:{errors}}  = useForm()
    const onSubmit = handleSubmit(async (data)=>{
        startLoading()
        if (data.email !== props.userEmail){
            try{
                await changeEmailForActivationAPI(props.userId, data.email)
                successfullyLoaded()
                props.userEmail = data.email
                setEmailChanged(true)
            } catch(error){
                if (error.message === BASE_FALLEN_SERVER_ERROR_MSG ){
                    setLoadingState(BASE_FALLEN_SERVER_LOG)
                } else {
                    setLoadingState(error.response.data.error==="email_exists" ? "Error, ese email ya fue registrado !" : "Error inesperado al modificar email !")
                }
            }
        } else {
            setLoadingState('No hay cambios !')
        }
    })
    useEffect(()=>{
        if (goBack || emailChanged){
            navigate('/signup/activate', {state: props})
        }
    }, [goBack, emailChanged])
    if (userIsAuthenticated()){
        return <UserLogged/>
    } else if (!props){
        return <UserNotLogged/>
    } else {
        return (
            <div className="centered-container">
                <div className="change-email-container">
                    <Header msg="Cambiando correo para activación"/>
                    <Loader state={loadingState}/>
                    <Form onSubmitFunction={onSubmit} buttonMsg="Cambiar" buttonsList={[
                        <Button key={v4()} buttonText="Volver" onClickFunction={()=>setGoBack(true)} />,
                    ]}>
                        <EmailField defaultValue={props.userEmail} errors={errors.email && errors.email.message} registerObject={register("email", BASE_EMAIL_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
        )
    }
}