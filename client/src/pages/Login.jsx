import { useForm } from "react-hook-form"
import { Header } from "../components/Header"
import { FormField } from "../components/FormField"
import { BASE_USERNAME_MAX_LENGTH, BASE_USERNAME_CONSTRAINTS, BASE_PASSWORD_CONSTRAINTS } from "../main"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserLogged } from "./UserLogged"
import { getUserDetailAPI } from "../api/getUserDetailApi.api"
import { useNavigate } from "react-router-dom"


export function Login() {
    const   {register, handleSubmit, formState : {errors}}  = useForm()
    const   navigate                                        = useNavigate()
    const   {loginUser}                                     = useContext(AuthContext)
    let     [user, setUser]                                 = useState(null)
    let     [userLogged, setUserLogged]                     = useState(false)
    let     [userNotExists, setUserNotExists]               = useState(false)
    let     [unExpectedError, setUnExpectedError]           = useState(false)
    const onSubmit = handleSubmit(async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        try{
            let response = await getUserDetailAPI(data.username)
            const user = response.data
            setUser(user)
            if (user.is_active){
                try {
                    response = await loginUser(data)
                    setUserLogged(true)
                } catch(error){
                    if (error.response.status === 401){
                        setUserNotExists(true) // en este caso el problema seria el password, no el username
                    } else {
                        setUnExpectedError("Error inesperado logeando usuario!")
                    }
                }
            }
        } catch(error){
            const errorMsg = error.response.data.error
            if (errorMsg ===  "user_not_exists"){
                setUserNotExists(true)
            } else {
                setUnExpectedError("Error inesperado en repuesta de api userDetail!")
            }
        }
    })

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
                <form onSubmit={onSubmit}>
                    {unExpectedError && unExpectedError}
                    <FormField  label="Nombre de usuario" errors={errors.username && errors.username.message || userNotExists && "Usuario o contraseña inválidos !"}>
                        <input 
                            defaultValue="pysanti"
                            type="text"
                            name="username"
                            id="username"
                            maxLength={BASE_USERNAME_MAX_LENGTH}
                            {...register("username", BASE_USERNAME_CONSTRAINTS)}
                        />
                    </FormField>
                    <FormField  label="Contraseña" errors={errors.password && errors.password.message}>
                        <input 
                            defaultValue="16102005 python"
                            type="password"
                            name="password"
                            id="password"
                            {...register("password", BASE_PASSWORD_CONSTRAINTS)}
                        />
                    </FormField>
                    <button type="submit">acceder</button>
                </form>
            </>
        )
    }
}