import { Header } from "../components/Header"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserLogged } from "./UserLogged"
import { getUserDetailAPI } from "../api/getUserDetailApi.api"
import { useNavigate } from "react-router-dom"
import { UserForm } from "../components/UserForm"
import { Loader } from "../components/Loader"
import { LoadingContext } from "../context/LoadingContext"
import "../styles/Login.css"

/**
 * Pagina creada para llevar logeo de usuarios
 */
export function Login() {
    let     {loadingState, startLoading,  successfullyLoaded, setLoadingState}  = useContext(LoadingContext)
    const   navigate                                                            = useNavigate()
    const   {loginUser}                                                         = useContext(AuthContext)
    let     [user, setUser]                                                     = useState(null)
    let     [userLogged, setUserLogged]                                         = useState(false)

    const onLogin = async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        try{
            startLoading(true)
            let response = await getUserDetailAPI(data.username)
            const user = response.data
            setUser(user)
            if (user.is_active){
                try {
                    response = await loginUser(data)
                    setUserLogged(true)
                    successfullyLoaded()
                } catch(error){
                    if (error.response.status === 401){
                        setLoadingState("Usuario o contraseña inválidos !") // en este caso el problema seria el password, no el username
                    } else {
                        setLoadingState("Error inesperado logeando usuario!")
                    }
                }
            }
        } catch(error){
            const errorMsg = error.response.data.error
            if (errorMsg ===  "user_not_exists"){
                setLoadingState("Usuario o contraseña inválidos !") // en este caso el problema seria el password, no el username
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
                    <UserForm onSubmitFunction={onLogin} login />
                </div>
            </div>
        )
    }
}