import { Header } from "../components/Header"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
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
/**
 * Pagina creada para llevar logeo de usuarios
 */
export function Login() {
    let     {loadingState, startLoading,  successfullyLoaded, setLoadingState}  = useContext(LoadingContext)
    const   navigate                                                            = useNavigate()
    const   {loginUser}                                                         = useContext(AuthContext)
    let     [user, setUser]                                                     = useState(null)
    let     [userLogged, setUserLogged]                                         = useState(false)
    let     [goBack, setGoBack]                                                 =   useState(false)

    const onLogin = async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        try{
            startLoading(true)
            let response = await getUserDetailAPI(data.username, data.password)
            setUser(response.data)
            if (response.data.is_active){
                try {
                    response = await loginUser(data)
                    setUserLogged(true)
                    successfullyLoaded()
                } catch(error){
                    if (error.response.status === 401){
                        setLoadingState("Usuario o contraseña inválidos !") 
                    } else {
                        setLoadingState("Error inesperado logeando usuario!")
                    }
                }
            }
        } catch(error){
            console.log(error)
            if (error.response.data.error===  "user_not_exists"){
                // por seguridad, la api retornara el mismo codigo de error para cuando el usuario o la contrasenia esten mal
                setLoadingState("Usuario o contraseña inválidos !") 
            } else {
                setLoadingState("Error inesperado en repuesta de api userDetail!")
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
        if (user){
            saveUserDataInLocalStorage(user)
            if (!user.is_active){
            // Se ejecutara si se detecta que el usuario existe pero esta inactivo
                const props = {
                    'userId' : user.id,
                    'username' : user.username,
                    'userEmail' : user.email
                }
                navigate('/signup/activate', {state: props})
            }
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
                    <LoginForm handleLogin={onLogin} extraButtons={[
                        <Button key={v4()} onClickFunction={()=>setGoBack(true)} buttonText="Volver"/>
                    ]}/>
                </div>
            </div>
        )
    }
}