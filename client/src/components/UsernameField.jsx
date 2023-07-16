import { FormField } from "./FormField";
import { BASE_USERNAME_MAX_LENGTH } from "../main";
import {PropTypes} from "prop-types"
/**
 * Componente creado para campos de nombre de usuario
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 */
export function UsernameField({errors, registerObject, defaultValue}){
    return (
        <FormField label="Usuario" errors={errors}>
            <input defaultValue={defaultValue ? defaultValue : null} type="text"name="username"id="username"maxLength={BASE_USERNAME_MAX_LENGTH} {...registerObject}/>
        </FormField>
    )
}

UsernameField.propTypes = {
    errors : PropTypes.string,
    registerObject : PropTypes.object,
}

UsernameField.defaultProps = {
    errors : undefined,
    defaultValue : undefined,
}
