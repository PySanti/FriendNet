import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { UserNotLogged } from "./UserNotLogged";
import { AuthContext } from "../context/AuthContext";
import { FormField } from "../components/FormField";
import { useForm } from "react-hook-form";
import {BASE_PASSWORD_CONSTRAINTS} from "../main"
import { changeUserPwdAPI } from "../api/changePwd.api";
import { SubmitStateContext } from "../context/SubmitStateContext";
import { UnExpectedError } from "../components/UnExpectedError";
import { Loader } from "../components/Loader";
import { useNavigate } from "react-router-dom";

/**
 * Componente creado para cambio de contraseña
 */
export function ChangePwd(){
    const {user} = useContext(AuthContext)
    const {register, handleSubmit, formState : {errors}} = useForm()
    const navigate = useNavigate()
    let   [backToProfile, setBackToProfile] = useState(false)
    let     {
        loadingState, 
        unExpectedError, 
        handleUnExpectedError, 
        startLoading, 
        setLoadingState, 
        nullSubmitStates,
        successfullyLoaded} = useContext(SubmitStateContext)
    const changePwd = handleSubmit(async (data)=>{
        if (data['old_password'] !== data['new_password']){
            startLoading()
            try{
                const response = await changeUserPwdAPI(user.username, data.old_password, data.new_password)
                successfullyLoaded()
            } catch(error){
                const errorMsg = error.response.data.error
                if (errorMsg === 'invalid_pwd'){
                    handleUnExpectedError('Error, la contraseña actual es invalida!')
                } else {
                    handleUnExpectedError('Error inesperado en respuesta de servidor')
                }
            }
        } else {
            handleUnExpectedError("No hay cambios")
        }
    })
    useEffect(()=>{
        if(backToProfile){
            navigate('/home/profile/')
        }
    }, [backToProfile])
    useEffect(()=>{
        nullSubmitStates()
    }, [])
    if (!userIsAuthenticated()){
        return (
            <UserNotLogged/>
        )
    } else {
        return (
            <>
                <Header username={user.username} msg="Modificando contraseña"/>
                {unExpectedError && <UnExpectedError msg={unExpectedError}/>}
                {loadingState && <Loader state={loadingState}/>}
                <form onSubmit={changePwd}>
                    <FormField label="Contrasenia actual" errors={errors.old_password && errors.old_password.message}>
                        <input type="password" id="old_password" name="old_password"{...register("old_password", BASE_PASSWORD_CONSTRAINTS)}/>
                    </FormField>
                    <FormField label="Contraseña nueva" errors={errors.new_password && errors.new_password.message}>
                        <input type="password" id="new_password" name="new_password"{...register("new_password", BASE_PASSWORD_CONSTRAINTS)}/>
                    </FormField>
                    <button type="submit">actualizar</button>
                </form>
                <button onClick={()=>setBackToProfile(true)}>volver</button>
            </>
        )
    }

}