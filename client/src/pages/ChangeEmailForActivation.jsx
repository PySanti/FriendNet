import { useContext, useEffect, useState } from "react";

import { Header } from "../components/Header";
import { LoadingContext } from "../context/LoadingContext";
import {  useLocation, useNavigate} from "react-router-dom";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";
import { EmailField } from "../components/EmailField";
import { BASE_EMAIL_CONSTRAINTS } from "../main";
import { Form } from "../components/Form";
import { Loader } from "../components/Loader";
import { UserNotLogged } from "./UserNotLogged";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserLogged } from "./UserLogged";

export function ChangeEmailForActivation(){
    const props                                         = useLocation().state
    const   navigate                                    = useNavigate()
    let {loadingState, setLoadingState, successfullyLoaded, startLoading} = useContext(LoadingContext)
    let [goBack, setGoBack]                             = useState(false )
    const {register, handleSubmit, formState:{errors}}  = useForm()
    const onSubmit = handleSubmit(async (data)=>{
        startLoading()
        if (data.email !== props.userEmail){
            props.userEmail = data.email
            successfullyLoaded()
        } else {
            setLoadingState('No hay cambios !')
        }
    })
    useEffect(()=>{
        if (goBack){
            navigate('/signup/activate', {state: props})
        }
    }, [goBack])
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
                        <EmailField defaultValue={props.userEmail} errors={errors.email && errors.email.message} registerObject={register("email", BASE_EMAIL_CONSTRAINTS)} label="Correo Electrónico"/>
                    </Form>
                </div>
            </div>
        )
    }
}