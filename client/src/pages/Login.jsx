import { useForm } from "react-hook-form"
import { Header } from "../components/Header"
import {BACKEND_URL, BASE_PASSWORD_CONSTRAINTS, BASE_USERNAME_CONSTRAINTS, BASE_USERNAME_MAX_LENGTH} from "../main.jsx"
import { FormField } from "../components/FormField"


export function Login() {
    let {register, handleSubmit, formState : {errors}} = useForm()
    const onSubmit = handleSubmit((data)=>{
        console.log('Logeando usuario')
        console.log(data)
    })
    return (
        <>
            <Header/>
            <form onSubmit={onSubmit}>
                <FormField  label="Nombre de usuario" errors={errors.username && errors.username.message}>
                    <input 
                        type="text"
                        name="username"
                        id="username"
                        maxLength={BASE_USERNAME_MAX_LENGTH}
                        {...register("username", BASE_USERNAME_CONSTRAINTS)}
                    />
                </FormField>
                <FormField  label="Contraseña" errors={errors.password && errors.password.message}>
                    <input 
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
