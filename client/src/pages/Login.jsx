import { Header } from "../components/Header"
import {  useEffect } from "react"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserLogged } from "./UserLogged"
import { getUserDetailAPI } from "../api/getUserDetailApi.api"
import { useNavigate } from "react-router-dom"
import { Loader } from "../components/Loader"
import "../styles/Login.css"
import { LoginForm } from "../components/LoginForm"
import { Button } from "../components/Button"
import { v4 } from "uuid"
import { saveUserDataInLocalStorage } from "../utils/saveUserDataInLocalStorage"
import { saveNotificationsInLocalStorage } from "../utils/saveNotificationsInLocalStorage"
import {loginUser} from "../utils/loginUser"
import {useLoadingState} from "../store/loadingStateStore"
import {BASE_UNEXPECTED_ERROR_LOG} from "../utils/constants"
import {handleStandardApiErrors} from "../utils/handleStandardApiErrors"
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
                navigate('/signup/activate', {state: {'userId' : userDetail.id,'username' : userDetail.username,'userEmail' : userDetail.email, 'password' : data.password}})
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
                    try{
                        if (error.response.data.error == "user_is_online"){
                            setLoadingState("El usuario ya esta en linea!") 
                        } else {
                            handleStandardApiErrors(error.response, setLoadingState, "Hubo un error logeando al usuario !")
                        }
                    } catch(error){
                        setLoadingState(BASE_UNEXPECTED_ERROR_LOG)
                    }
                }
            }
        } catch(error){
            try{
                if (error.response.data.error===  "user_not_exists"){
                    // por seguridad, la api retornara el mismo codigo de error para cuando el usuario o la contrasenia esten mal
                    setLoadingState("Usuario o contraseña inválidos !") 
                } else {
                    handleStandardApiErrors(error.response, setLoadingState, "Error inesperado encontrando datos del usuario !")
                }
            } catch(error){
                setLoadingState(BASE_UNEXPECTED_ERROR_LOG)
            }
        }
    }
    useEffect(()=>{
        setLoadingState(false)
    }, [])

    if (userIsAuthenticated()){
        return <UserLogged/> 
    } else{
        return (
            <div className="centered-container">
                <div className="login-container">
                    <Header msg="Introduce tus credenciales para ingresar"/>
                    <Loader/>
                    <LoginForm handleLogin={onLogin} extraButtons={[<Button key={v4()} onClickFunction={()=>{navigate('/')}} buttonText="Volver"/>]}/>
                </div>
            </div>
        )
    }
}