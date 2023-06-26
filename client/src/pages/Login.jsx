import { useForm } from "react-hook-form"
import { Header } from "../components/Header"
import { FormField } from "../components/FormField"
import { BASE_USERNAME_MAX_LENGTH, BASE_USERNAME_CONSTRAINTS, BASE_PASSWORD_CONSTRAINTS } from "../main"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserLogged } from "./UserLogged"
import { getUserDetailAPI } from "../api/getUserDetailApi.api"


export function Login() {
    const   {register, handleSubmit, formState : {errors}} = useForm()
    const   {loginUser} = useContext(AuthContext)
    let     [userIsUnactive, setUserIsUnactive] = useState(false)
    let     [user, setUser] = useState(null)
    let     [userLogged, setUserLogged] = useState(false)
    const onSubmit = handleSubmit(async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        let response = await getUserDetailAPI(data.username)
        if (response.status === 200){
            const user = response.data
            setUser(user)
            if (user.is_active){
                response = await loginUser(data)
                if (response.status === 200){
                    setUserLogged(true)
                } else {
                    // handle
                }
            } else if (!user.is_active){
                setUserIsUnactive(true)
            } else {
                alert('Error con respuesta de api de checkeo de usuario activo')
            }
        } else {
            // handle
        }
    })
    if (userLogged){
        return <Navigate to="/home/"/>
    }
    if (userIsUnactive){
        const props = {
            'userId' : user.id,
            'username' : user.username,
            'userEmail' : user.email
        }
        return <Navigate to="/signup/activate" state={props}/>
    } else if (userIsAuthenticated()){
        return <UserLogged/> 
    } else{
        return (
            <>
                <Header/>
                <form onSubmit={onSubmit}>
                    <FormField  label="Nombre de usuario" errors={errors.username && errors.username.message}>
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