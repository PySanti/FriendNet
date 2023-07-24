import { useContext, useEffect, useState } from "react";
import { FormField } from "../components/FormField"
import { Header } from "../components/Header";
import { LoadingContext } from "../context/LoadingContext";
import { Form} from "react-router-dom";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";

export function ChangeEmailForActivation(){
    let {loadingState, setLoadingState, successfullyLoaded, startLoading} = useContext(LoadingContext)
    let [goBack, setGoBack]                             = useState(false )
    const {register, handleSubmit, formState:{errors}}  = useForm()
    const onSubmit = handleSubmit(async ()=>{
        console.log('Hola')
    })
    useEffect(()=>{
        if (goBack){
            console.log("Volviendo")
        }
    }, [goBack])
    return (
        <div className="centered-container">
            <div className="change-email-container">
                <Header msg="Cambiando correo para activación"/>
                <Header state={loadingState}/>
                <Form onSubmitFunction={onSubmit} buttonMsg="Enviar" buttonsList={[
                    <Button key={v4()} buttonText="Volver" onClickFunction={()=>setGoBack(true)} />,
                ]}>
                    <FormField label="Nuevo email " errors={errors.email && errors.email.message}>
                        <input type="text"maxLength={6}minLength={1}name="activation_code"id="activation_code"{...register("activation_code", {    required : {        value : true,        message : "Por favor ingresa un código de activación"    },    pattern : {        value : /^-?\d+$/,        message : "Por favor, ingresa un codigo valido"    },    minLength : {        value : 6,        message : 'Debes ingresar al menos 6 caracteres',    }    })}/>
                    </FormField>
                </Form>
            </div>
        </div>
    )
}