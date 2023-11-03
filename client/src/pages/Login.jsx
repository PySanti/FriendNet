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
import {useLoadingState} from "../store/loadingStateStore"
import {BASE_UNEXPECTED_ERROR_LOG} from "../utils/constants"
import {generateLocationProps} from "../utils/generateLocationProps"
/**
 * Pagina creada para llevar logeo de usuarios
 */
export function Login() {
    const   [startLoading,  successfullyLoaded, setLoadingState]  = useLoadingState((state)=>([state.startLoading, state.successfullyLoaded, state.setLoadingState]))
    const   navigate                                                            = useNavigate()

    const onLogin = async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        try{
            startLoading()
            let response = await getUserDetailAPI(data.username, data.password)
            const userDetail = response.data.user
            if (!userDetail.is_active){
                navigate('/signup/activate', {state: generateLocationProps(userDetail.email, userDetail.username, userDetail.id)})
            } else {
                try {
                    await loginUser(data)
                    const notifications = userDetail.notifications
                    delete userDetail.notifications
                    saveNotificationsInLocalStorage(notifications)
                    saveUserDataInLocalStorage(userDetail)
                    successfullyLoaded()
                    navigate('/home/')
                } catch(error){
                    if (error.response.data.error == "user_is_online"){
                        setLoadingState("El usuario ya esta en linea!") 
                    } else {
                        setLoadingState(BASE_UNEXPECTED_ERROR_LOG)
                    }
                }
            }
        } catch(error){
            if (error.response.data.error===  "user_not_exists"){
                // por seguridad, la api retornara el mismo codigo de error para cuando el usuario o la contrasenia esten mal
                setLoadingState("Usuario o contraseña inválidos !") 
            } else {
                setLoadingState(BASE_UNEXPECTED_ERROR_LOG)
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