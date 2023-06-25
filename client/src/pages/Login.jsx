import { useForm } from "react-hook-form"
import { Header } from "../components/Header"
import { FormField } from "../components/FormField"
import { BASE_USERNAME_MAX_LENGTH, BASE_USERNAME_CONSTRAINTS, BASE_PASSWORD_CONSTRAINTS } from "../main"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserLogged } from "./UserLogged"


export function Login() {
    const {register, handleSubmit, formState : {errors}} = useForm()
    const {loginUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const onSubmit = handleSubmit(async (data)=>{
        if (!localStorage.getItem('authToken')){
            const response = await loginUser(data)
            if (response.status === 200){
                navigate('/home')
            } else {
                // handle
            }
        }
    })
    if (userIsAuthenticated()){
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