import { Form } from "./Form";
import { PasswordField } from "./PasswordField";
import { UsernameField } from "./UsernameField";
import { useForm } from "react-hook-form";
import { BASE_USERNAME_CONSTRAINTS, BASE_PASSWORD_CONSTRAINTS } from "../main";

export function LoginForm({handleLogin}){
    const {register, handleSubmit, formState: {errors}}  = useForm()
    const onSubmit = handleSubmit((data)=>{
        handleLogin(data)
    })
    return (
        <Form onSubmitFunction={onSubmit} buttonMsg={"Acceder"}> 
            <UsernameField errors={errors.username && errors.username.message} registerObject={register("username", BASE_USERNAME_CONSTRAINTS)}/>
            <PasswordField label="Contraseña" name="password"  errors={errors.password && errors.password.message} registerObject={register("password", BASE_PASSWORD_CONSTRAINTS)}/>
        </Form>
    )
}