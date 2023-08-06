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
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_JWT_ERROR_LOG} from "../utils/constants"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import { validateJWT } from "../utils/validateJWT"
import {refreshToken} from "../utils/refreshToken"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"

/**
 * Pagina creado para cambio de contraseña
 */
export function ChangePwd(){
    const {register, handleSubmit, formState : {errors}} = useForm()
    const navigate = useNavigate()
    let   [backToProfile, setBackToProfile] = useState(false)
    let   {loadingState, setLoadingState, successfullyLoaded, startLoading} = useContext(LoadingContext)
    let   [user] = useState(getUserDataFromLocalStorage())
    const changePwd = handleSubmit(async (data)=>{
        const successValidating = validateJWT()
        if (successValidating){
            if (data['old_password'] !== data['new_password']){
                startLoading()
                try{
                    await changeUserPwdAPI(data.old_password, data.new_password, getJWTFromLocalStorage().access)
                    successfullyLoaded()
                } catch(error){
                    if (error.message === BASE_FALLEN_SERVER_ERROR_MSG){
                        setLoadingState(BASE_FALLEN_SERVER_LOG)
                    } else {
                        setLoadingState(error.response.data.error === 'invalid_pwd' ? "Error, la contraseña actual es invalida !" : 'Error inesperado en respuesta de servidor')
                    } 
                }
            } else {
                setLoadingState("No hay cambios")
            }
        } else {
            setLoadingState(BASE_JWT_ERROR_LOG)
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
                        <Button key={v4()} buttonText="Volver" onClickFunction={()=>setBackToProfile(true)}/>
                    ]}>
                        <PasswordField label="Contrasenia actual" errors={errors.old_password && errors.old_password.message} name="old_password" registerObject={register("old_password", BASE_PASSWORD_CONSTRAINTS)}/>
                        <PasswordField label="Nueva contraseña" errors={errors.new_password && errors.new_password.message} name="new_password" registerObject={register("new_password", BASE_PASSWORD_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
        )
    }
}