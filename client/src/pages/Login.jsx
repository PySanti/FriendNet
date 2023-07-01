import { Header } from "../components/Header"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserLogged } from "./UserLogged"
import { getUserDetailAPI } from "../api/getUserDetailApi.api"
import { useNavigate } from "react-router-dom"
import { UnExpectedError } from "../components/UnExpectedError"
import { UserForm } from "../components/UserForm"
import { Loader } from "../components/Loader"
import { SubmitStateContext } from "../context/SubmitStateContext"


/**
 * Pagina creada para llevar logeo de usuarios
 */
export function Login() {
    let     {loadingState, unExpectedError, handleUnExpectedError, startLoading, nullSubmitStates, successfullyLoaded} = useContext(SubmitStateContext)
    const   navigate                                                        = useNavigate()
    const   {loginUser}                                                     = useContext(AuthContext)
    let     [user, setUser]                                                 = useState(null)
    let     [userLogged, setUserLogged]                                     = useState(false)

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
                        handleUnExpectedError("Usuario o contraseña inválidos !") // en este caso el problema seria el password, no el username
                    } else {
                        handleUnExpectedError("Error inesperado logeando usuario!")
                    }
                }
            }
        } catch(error){
            const errorMsg = error.response.data.error
            if (errorMsg ===  "user_not_exists"){
                handleUnExpectedError("Usuario o contraseña inválidos !") // en este caso el problema seria el password, no el username
            } else {
                handleUnExpectedError("Error inesperado en repuesta de api userDetail!")
            }
        }
    }
    useEffect(()=>{
        nullSubmitStates()
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
            <>
                <Header/>
                {unExpectedError && <UnExpectedError msg = {unExpectedError}/>}
                {loadingState && <Loader state={loadingState}/>}
                <UserForm onSubmitFunction={onLogin}login={true}/>
            </>
        )
    }
}