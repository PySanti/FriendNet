import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { AuthContext } from "../context/AuthContext";
import { FormField } from "../components/FormField";
import { useForm } from "react-hook-form";
import {BASE_PASSWORD_CONSTRAINTS} from "../main"
import { changeUserPwdAPI } from "../api/changePwd.api";
import { LoadingContext } from "../context/LoadingContext";
import { Loader } from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { PasswordField } from "../components/PasswordField";

/**
 * Pagina creado para cambio de contraseña
 */
export function ChangePwd(){
    const {user} = useContext(AuthContext)
    const {register, handleSubmit, formState : {errors}} = useForm()
    const navigate = useNavigate()
    let   [backToProfile, setBackToProfile] = useState(false)
    let   {loadingState, setLoadingState, successfullyLoaded, startLoading} = useContext(LoadingContext)
    const changePwd = handleSubmit(async (data)=>{
        if (data['old_password'] !== data['new_password']){
            startLoading()
            try{
                const response = await changeUserPwdAPI(user.username, data.old_password, data.new_password)
                successfullyLoaded()
            } catch(error){
                const errorMsg = error.response.data.error
                if (errorMsg === 'invalid_pwd'){
                    setLoadingState('Error, la contraseña actual es invalida!')
                } else {
                    setLoadingState('Error inesperado en respuesta de servidor')
                }
            }
        } else {
            setLoadingState("No hay cambios")
        }
    })
    useEffect(()=>{
        if(backToProfile){
            navigate('/home/profile/')
        }
    }, [backToProfile])
    useEffect(()=>{
        setLoadingState(false)
    }, [])
    if (!userIsAuthenticated()){
        return (
            <UserNotLogged/>
        )
    } else {
        return (
            <div className="centered-container">
                <div className="change-pwd-container">
                    <Header username={user.username} msg="Modificando contraseña"/>
                    <Loader state={loadingState}/>
                    <Form onSubmitFunction={changePwd} buttonMsg="Enviar" buttonsList={[
                        <Button key={1} buttonText="Volver" onClickFunction={()=>setBackToProfile(true)}/>
                    ]}>
                        <PasswordField label="Contrasenia actual" errors={errors.old_password && errors.old_password.message} name="old_password" registerObject={register("old_password", BASE_PASSWORD_CONSTRAINTS)}/>
                        <PasswordField label="Nueva contraseña" errors={errors.new_password && errors.new_password.message} name="new_password" registerObject={register("new_password", BASE_PASSWORD_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
        )
    }
}