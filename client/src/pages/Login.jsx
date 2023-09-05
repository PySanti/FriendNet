import { Header } from "../components/Header"
import { useContext, useEffect, useState } from "react"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserLogged } from "./UserLogged"
import { getUserDetailAPI } from "../api/getUserDetailApi.api"
import { useNavigate } from "react-router-dom"
import { Loader } from "../components/Loader"
import { LoadingContext } from "../context/LoadingContext"
import "../styles/Login.css"
import { LoginForm } from "../components/LoginForm"
import { Button } from "../components/Button"
import { v4 } from "uuid"
import { saveUserDataInLocalStorage } from "../utils/saveUserDataInLocalStorage"
import { saveNotificationsInLocalStorage } from "../utils/saveNotificationsInLocalStorage"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG} from "../utils/constants"
import {loginUser} from "../utils/loginUser"
/**
 * Pagina creada para llevar logeo de usuarios
 */
export function Login() {
    let     {loadingState, startLoading,  successfullyLoaded, setLoadingState}  = useContext(LoadingContext)
    const   navigate                                                            = useNavigate()
    let     [user, setUser]                                                     = useState(null)
    let     [userLogged, setUserLogged]                                         = useState(false)
    let     [goBack, setGoBack]                                                 =   useState(false)

    const onLogin = async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        try{
            startLoading()
            let response = await getUserDetailAPI(data.username, data.password)
            const userDetail = response.data.user
            setUser(userDetail)
            if (userDetail.is_active){
                try {
                    response = await loginUser(data)
                    const notifications = userDetail.notifications
                    delete userDetail.notifications
                    saveNotificationsInLocalStorage(notifications)
                    saveUserDataInLocalStorage(userDetail)
                    successfullyLoaded()
                    setUserLogged(true)
                } catch(error){
                    setLoadingState("Error inesperado logeando usuario!") 
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
    useEffect(()=>{
        // Se ejecutara cuando se finalice el proceso de logeo
        if (userLogged){
            navigate('/home/')
        }
    }, [userLogged])
    useEffect(()=>{
        if (goBack){
            navigate('/')
        }
    }, [goBack])
    useEffect(()=>{
        if (user && !user.is_active){
            // Se ejecutara si se detecta que el usuario existe pero esta inactivo
            const props = {
                'userId' : user.id,
                'username' : user.username,
                'userEmail' : user.email
            }
            navigate('/signup/activate', {state: props})
        }
    }, [user])


    if (userIsAuthenticated()){
        return <UserLogged/> 
    } else{
        return (
            <div className="centered-container">
                <div className="login-container">
                    <Header msg="Introduce tus credenciales para ingresar"/>
                    <Loader state={loadingState}/>
                    <LoginForm handleLogin={onLogin} extraButtons={[<Button key={v4()} onClickFunction={()=>setGoBack(true)} buttonText="Volver"/>]}/>
                </div>
            </div>
        )
    }
}