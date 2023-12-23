import "../styles/ChangePwdStyles.css"
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useForm } from "react-hook-form";
import {BASE_PASSWORD_CONSTRAINTS} from "../utils/constants"
import { changeUserPwdAPI } from "../api/changePwd.api";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { PasswordField } from "../components/PasswordField";
import { v4 } from "uuid";
import {useState, useEffect} from "react"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeApi} from "../utils/executeApi"
import {useLoadingState} from "../store"
import {emptyErrors} from "../utils/emptyErrors"


/**
 * Pagina creado para cambio de contraseña
 */
export function ChangePwd(){
    let [changeDetected, setChangeDetected] = useState(false)
    const {register, handleSubmit, formState, watch} = useForm()
    const errors = formState.errors
    const navigate = useNavigate()
    const   [ setLoadingState, successfullyLoaded, startLoading] = useLoadingState((state)=>([state.setLoadingState, state.successfullyLoaded, state.startLoading]))
    const changePwd = handleSubmit(async (data)=>{
        if (data['oldPwd'] !== data['newPwd']){
            startLoading()
            const response = await executeApi(async ()=>{
                return await changeUserPwdAPI(data.oldPwd, data.newPwd, getJWTFromLocalStorage().access)
            }, navigate, setLoadingState)
            if (response){
                if (response.status == 200){
                    successfullyLoaded()
                } else if (response.data.error === 'invalid_pwd'){
                    setLoadingState("¡ Error, la contraseña actual es invalida !")
                } else {
                    setLoadingState('¡ Error inesperado cambiando la contraseña !')
                }
            }
        } else {
            setLoadingState("No hay cambios")
        }
    })
    useEffect(()=>{
        // recordar el por que del uso de new_val
        let new_val = false
        if (emptyErrors(errors)){
            new_val = watch("newPwd") && watch("oldPwd") ?  true : false
        } else {
            new_val = false
        }
        if (changeDetected != new_val){
            setChangeDetected(new_val)
        }
    }, [formState])
    if (!userIsAuthenticated()){
        return  <UserNotLogged msg="No puedes cambiar tu contraseña si aun no tienes cuenta o no has iniciado sesión en ella"/>
    } else {
        return (
            <div className="centered-container">
                <div className="change-pwd-container">
                    <Header msg="Modificando contraseña"/>
                    <div className="change-pwd-container__form-container">
                        <Form 
                            button_hovered={changeDetected}
                            onSubmitFunction={changePwd} 
                            buttonMsg="Modificar" 
                            buttonsList={[<Button key={v4()} 
                                buttonText="Volver" 
                                onClickFunction={()=>{navigate('/home/profile')}} />]} 
                            >
                            <PasswordField label="Contraseña actual" errors={errors.oldPwd && errors.oldPwd.message} registerObject={register("oldPwd", BASE_PASSWORD_CONSTRAINTS)}/>
                            <PasswordField label="Nueva contraseña" errors={errors.newPwd && errors.newPwd.message} registerObject={register("newPwd", BASE_PASSWORD_CONSTRAINTS)}/>
                        </Form>
                    </div>

                </div>
            </div>
        )
    }
}