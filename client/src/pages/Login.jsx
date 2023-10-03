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
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG} from "../utils/constants"
import {loginUser} from "../utils/loginUser"
import {useLoadingState} from "../store/loadingStateStore"
/**
 * Pagina creada para llevar logeo de usuarios
 */
export function Login() {
    const     [loadingState, startLoading,  successfullyLoaded, setLoadingState]  = useLoadingState((state)=>([state.loadingState, state.startLoading, state.successfullyLoaded, state,setLoadingState]))
    const   navigate                                                            = useNavigate()

    const onLogin = async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        try{
            startLoading()
            let response = await getUserDetailAPI(data.username, data.password)
            const userDetail = response.data.user
            if (!userDetail.is_active){
                navigate('/signup/activate', {state: {'userId' : userDetail.id,'username' : userDetail.username,'userEmail' : userDetail.email}})
            } else {
                try {
                    response = await loginUser(data)
                    const notifications = userDetail.notifications
                    delete userDetail.notifications
                    saveNotificationsInLocalStorage(notifications)
                    saveUserDataInLocalStorage(userDetail)
                    successfullyLoaded()
                    navigate('/home/')
                } catch(error){
                    setLoadingState(error.response.data.error == "user_is_online" ? "El usuario ya esta en linea!" : "Error inesperado logeando usuario!") 
                }
            }
        } catch(error){
            if (error.message === BASE_FALLEN_SERVER_ERROR_MSG){
                setLoadingState(BASE_FALLEN_SERVER_LOG)
            } else {
                // por seguridad, la api retornara el mismo codigo de error para cuando el usuario o la contrasenia esten mal
                setLoadingState(error.response.data.error===  "user_not_exists" ? "Usuario o contraseña inválidos !" : "Error inesperado en respuesta de servidor, esta caido !") 
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