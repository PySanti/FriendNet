import { Form } from "./Form";
import { PasswordField } from "./PasswordField";
import { UsernameField } from "./UsernameField";
import { useForm } from "react-hook-form";
import { BASE_USERNAME_CONSTRAINTS, BASE_PASSWORD_CONSTRAINTS } from "../utils/constants";
import {PropTypes} from "prop-types"
import { Button } from "./Button";
/**
 * Componente creado para el logeo del usuario
 * @param {Function} handleLogin funcion que sera ejecutada cuando se envie el formulario
 * @param {Array} extraButtons buttons a renderizar junto al submit button
 */
export function LoginForm({handleLogin, extraButtons}){
    const {register, handleSubmit, formState: {errors}}  = useForm()
    const onSubmit = handleSubmit((data)=>{
        handleLogin(data)
    })
    return (
        <Form onSubmitFunction={onSubmit} buttonMsg={"Acceder"} buttonsList={extraButtons} > 
            <UsernameField errors={errors.username && errors.username.message} registerObject={register("username", BASE_USERNAME_CONSTRAINTS)}/>
            <PasswordField label="Contraseña" name="password"  errors={errors.password && errors.password.message} registerObject={register("password", BASE_PASSWORD_CONSTRAINTS)}/>
        </Form>
    )
}

LoginForm.propTypes = {
    handleLogin : PropTypes.func.isRequired,
    extraButtons : PropTypes.array,
}
LoginForm.defaultProps = {
    extraButtons : undefined,
}
