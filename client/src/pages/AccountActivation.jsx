// components
import {  useLocation, useNavigate, useParams } from "react-router-dom"
import { Header } from "../components/Header"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
// api's
import { activateUserAPI } from "../api/activateUser.api"
import { FormField } from "../components/FormField"

export function AccountActivation() {
    const props = useLocation().state
    console.log(props)
    const navigate = useNavigate()
    const {register, handleSubmit, formState:{errors}} = useForm()
    let [userActivated, setUserActivated] = useState(false)
    const onSubmit = handleSubmit(async (data)=>{
        if (Number(data.activation_code) === Number(props.activation_code)){
            try {
                const response = await activateUserAPI(props.userId)
                if (response.status === 200){
                    console.log('Exito activando el usuario')
                    console.log(response)
                    setUserActivated(true)
                } else {
                    console.log('Error activando usuario')
                    console.log(response)
                }
            } catch(error){
                console.log('Error activando el usuario')
                console.log(error)
            }
        }
    })
    useEffect(()=>{
        if (userActivated === true){
            navigate('/login/')
        }
    }, [userActivated, navigate])
    return (
        <>
            <Header/>
            <div>
                <h1>
                    Ingresa el código de activación
                </h1>
                <form onSubmit={onSubmit}>
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
