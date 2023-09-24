import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useForm } from "react-hook-form";
import {BASE_PASSWORD_CONSTRAINTS} from "../utils/constants"
import { changeUserPwdAPI } from "../api/changePwd.api";
import { LoadingContext } from "../context/LoadingContext";
import { Loader } from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { PasswordField } from "../components/PasswordField";
import { v4 } from "uuid";
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG} from "../utils/constants"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {executeSecuredApi} from "../utils/executeSecuredApi"
/**
 * Pagina creado para cambio de contraseña
 */
export function ChangePwd(){
    const {register, handleSubmit, formState : {errors}} = useForm()
    const navigate = useNavigate()
    const   user = getUserDataFromLocalStorage()
    let   {loadingState, setLoadingState, successfullyLoaded, startLoading} = useContext(LoadingContext)
    const changePwd = handleSubmit(async (data)=>{
        if (data['oldPwd'] !== data['newPwd']){
            startLoading()
            const response = await executeSecuredApi(async ()=>{
                return await changeUserPwdAPI(data.oldPwd, data.newPwd, getJWTFromLocalStorage().access)
            }, navigate)
            if (response){
                if (response !== "unexpected_error" && response.status == 200){
                    successfullyLoaded()
                } else {
                    if (response.message === BASE_FALLEN_SERVER_ERROR_MSG){
                        setLoadingState(BASE_FALLEN_SERVER_LOG)
                    } else {
                        setLoadingState(response.response.data.error === 'invalid_pwd' ? "Error, la contraseña actual es invalida !" : 'Error inesperado en respuesta de servidor')
                    } 
                }
            }
        } else {
            setLoadingState("No hay cambios")
        }
    })

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
                    <Form onSubmitFunction={changePwd} buttonMsg="Enviar" buttonsList={[<Button key={v4()} buttonText="Volver" onClickFunction={()=>{navigate('/home/profile')}}/>]}>
                        <PasswordField label="Contrasenia actual" errors={errors.oldPwd && errors.oldPwd.message} registerObject={register("oldPwd", BASE_PASSWORD_CONSTRAINTS)}/>
                        <PasswordField label="Nueva contraseña" errors={errors.newPwd && errors.newPwd.message} registerObject={register("newPwd", BASE_PASSWORD_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
        )
    }
}