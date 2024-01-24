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
import {generateLocationProps} from "../utils/generateLocationProps"
import {executeApi} from "../utils/executeApi"
import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"
/**
 * Pagina creada para llevar logeo de usuarios
 */
export function Login() {
    const   [startLoading, setLoadingState]  = useLoadingState((state)=>([state.startLoading, state.setLoadingState]))
    const   navigate                                                            = useNavigate()

    const onLogin = async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        let response = await executeApi(async ()=>{
            return await getUserDetailAPI(data.username, data.password)
        }, navigate)
        if (response){
            if (response.status == 200){
                const userDetail = response.data.user
                if (!userDetail.is_active){
                    navigate('/signup/activate', {state: generateLocationProps(userDetail.email, userDetail.username, userDetail.id)})
                } else {
                    response = await executeApi(async ()=>{
                        return await loginUser(data)
                    }, navigate)
                    if (response){
                        if (response.status == 200){
                            const notifications = userDetail.notifications
                            delete userDetail.notifications
                            saveNotificationsInLocalStorage(notifications)
                            saveUserDataInLocalStorage(userDetail)
                            setLoadingState(false)
                            navigate('/home/')
                        } else if (response.data.error == "user_is_online"){
                            setLoadingState("¡ El usuario ya esta en linea !") 
                        } else{
                            setLoadingState("¡ Error inesperado iniciando sesión !")
                        } 
                    }
                }
            } else if (response.data.error == "user_not_exists"){
                // por seguridad, la api retornara el mismo codigo de error para cuando el usuario o la contrasenia esten mal
                setLoadingState("¡ Usuario o contraseña inválidos !") 
            } else {
                setLoadingState("¡ Error inesperado buscando datos del usuario !")
            }
        }
    }
    useEffect(()=>{
        document.title = generateDocumentTitle("Iniciando Sesión")
    }, [])
    if (userIsAuthenticated()){
        return <UserLogged/> 
    } else{
        return (
            <div className="centered-container">
                <div className="login-container">
                    <Header msg="Introduce tus credenciales para ingresar"/>
                    <LoginForm handleLogin={onLogin} extraButtons={[<Button key={v4()} onClickFunction={()=>{navigate('/')}} back/>]}/>
                </div>
            </div>
        )
    }
}