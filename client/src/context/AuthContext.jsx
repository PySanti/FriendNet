import { createContext, useState, useEffect } from "react";
import { loginUserAPI } from "../api/loginUser.api";
import jwt_decode from "jwt-decode";
import { refreshTokenAPI } from "../api/refreshToken.api";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { disconnectUserAPI } from "../api/disconnectUser.api";


export const AuthContext = createContext()

/**
 * Context creado para contener datos del usuario logeado (id y username)
 * Ademas para contener el token de autenticacion, token de refresco y metodo para refrescar tokens
 */
export function AuthContextProvider({children}){
    const userStorageData = localStorage.getItem('authToken')
    // se comprueba que las credenciales del usuario no esten ya en el localStorage para
    // evitar que siempre que se recargue el context, se anulen nuevamente las variables que lo conforman
    let [authToken, setAuthToken]   = useState(()=>userStorageData ? JSON.parse(userStorageData) : null)
    let [user, setUser]             = useState(()=>userStorageData ? jwt_decode(JSON.parse(userStorageData).access) : null)
    const updateContextData=(data)=>{
        setAuthToken(data) // context
        setUser(data? jwt_decode(data.access) : null) //context
        if (!data){
            localStorage.removeItem('authToken')
        } else {
            localStorage.setItem('authToken', JSON.stringify(data))
        }
    }
    const loginUser = async (formData) =>{
        const response = await loginUserAPI(formData.username, formData.password)
        if (response.status === 200){
            updateContextData(response.data)
        }
        return response
    }
    const logoutUser = ()=>{
        disconnectUserAPI( authToken.access)
        localStorage.clear()
        updateContextData(null)
    }

    const refreshToken = async ()=>{
        console.log('Refrescando token')
        try {
            const response = await refreshTokenAPI(authToken.refresh)
            updateContextData(response.data)
        } catch(error) {
            // comprobar si el token esta caducado, en ese caso, enviar al usuario a logearse
            console.error('Error inesperado al refrescar tokens')
        }
    }
    useEffect(() => {
        const refreshTime = 1000 * 60 * 9
        if (userIsAuthenticated()){ // hacemos esto para que el token se actualice justo cuando el usuario carga la pagina
            let intervalId = setInterval(async ()=>{
                console.log('Refrescando token')
                // await refreshToken()
            }, refreshTime)
            return ()=>clearInterval(intervalId) //* al retornar una funcion, hacemos que esta se ejecute cuando elcomponente se vuelva a montar
        }
    }, [authToken])
    const contextData = {
        refreshToken : refreshToken,
        user : user,
        loginUser : loginUser,
        logoutUser : logoutUser,
    }
    return (
        <AuthContext.Provider value={{...contextData}}>
            {children}
        </AuthContext.Provider>
    )
}