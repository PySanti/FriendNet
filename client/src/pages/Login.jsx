import { Header } from "../components/Header"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserLogged } from "./UserLogged"
import { getUserDetailAPI } from "../api/getUserDetailApi.api"
import { useNavigate } from "react-router-dom"
import "../styles/Login.css"
import { LoginForm } from "../components/LoginForm"
import { Button } from "../components/Button"
import { v4 } from "uuid"
import { saveUserDataInLocalStorage } from "../utils/saveUserDataInLocalStorage"
import { saveNotificationsInLocalStorage } from "../utils/saveNotificationsInLocalStorage"
import {loginUser} from "../utils/loginUser"
import {useLoadingState} from "../store"
import {BASE_UNEXPECTED_ERROR_LOG} from "../utils/constants"
import {generateLocationProps} from "../utils/generateLocationProps"
import {executeApi} from "../utils/executeApi"
/**
 * Pagina creada para llevar logeo de usuarios
 */
export function Login() {
    const   [startLoading,  successfullyLoaded, setLoadingState]  = useLoadingState((state)=>([state.startLoading, state.successfullyLoaded, state.setLoadingState]))
    const   navigate                                                            = useNavigate()

    const onLogin = async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        startLoading()
        let response = await executeApi(async ()=>{
            return await getUserDetailAPI(data.username, data.password)
        }, navigate, setLoadingState)
        if (response){
            if (response.status == 200){
                const userDetail = response.data.user
                if (!userDetail.is_active){
                    navigate('/signup/activate', {state: generateLocationProps(userDetail.email, userDetail.username, userDetail.id)})
                } else {
                    response = await executeApi(async ()=>{
                        return await loginUser(data)
                    }, navigate, setLoadingState)
                    if (response){
                        if (response.status == 200){
                            const notifications = userDetail.notifications
                            delete userDetail.notifications
                            saveNotificationsInLocalStorage(notifications)
                            saveUserDataInLocalStorage(userDetail)
                            successfullyLoaded()
                            navigate('/home/')
                        } else if (response.data.error == "user_is_online"){
                            setLoadingState("El usuario ya esta en linea!") 
                        } else{
                            setLoadingState("Error inesperado iniciando sesión !")
                        } 
                    }
                }
            } else if (response.data.error == "user_not_exists"){
                // por seguridad, la api retornara el mismo codigo de error para cuando el usuario o la contrasenia esten mal
                setLoadingState("Usuario o contraseña inválidos !") 
            } else {
                setLoadingState("Error inesperado buscando datos del usuario !")
            }
        }
    }

    if (userIsAuthenticated()){
        return <UserLogged/> 
    } else{
        return (
            <div className="centered-container">
                <div className="login-container">
                    <Header msg="Introduce tus credenciales para ingresar"/>
                    <LoginForm handleLogin={onLogin} extraButtons={[<Button key={v4()} onClickFunction={()=>{navigate('/')}} buttonText="Volver"/>]}/>
                </div>
            </div>
        )
    }
}