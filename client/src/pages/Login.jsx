import { Header } from "../components/Header"
import {toast} from "sonner"
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
import {generateLocationProps} from "../utils/generateLocationProps"
import {executeApi} from "../utils/executeApi"
import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"
/**
 * Pagina creada para llevar logeo de usuarios
 */
export function Login() {
    const   navigate                                                            = useNavigate()

    const onLogin = async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        toast.loading("Iniciando sesión")
        let response = await executeApi(async ()=>{
            return await getUserDetailAPI(data.username, data.password)
        }, navigate)
        if (response){
            if (response.status == 200){
                const userDetail = response.data.user
                if (!userDetail.is_active){
                    toast.error('Activa tu cuenta antes de continuar')
                    navigate('/signup/activate', {state: generateLocationProps(userDetail.email, userDetail.username, userDetail.id)})
                } else {
                    response = await executeApi(async ()=>{
                        return await loginUser(data)
                    }, navigate)
                    if (response){
                        if (response.status == 200){
                            const baseNotifications = userDetail.notifications
                            delete userDetail.notifications
                            saveNotificationsInLocalStorage(baseNotifications)
                            saveUserDataInLocalStorage(userDetail)
                            toast.success("Sesión iniciada con éxito")
                            navigate('/home/')
                        } else if (response.data.error == "user_is_online"){
                            toast.error("¡ El usuario ya esta en linea !") 
                        } else{
                            toast.error("¡ Error inesperado iniciando sesión !")
                        } 
                    }
                }
            } else if (response.data.error == "user_not_exists"){
                // por seguridad, la api retornara el mismo codigo de error para cuando el usuario o la contrasenia esten mal
                toast.error("¡ Usuario o contraseña inválidos !") 
            } else {
                toast.error("¡ Error inesperado buscando datos del usuario !")
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