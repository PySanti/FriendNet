import { FormField } from "./FormField";
import {BASE_EMAIL_MAX_LENGTH} from "../utils/constants"
import {PropTypes} from "prop-types"
/**
 * Componente creado para campos de email
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {String} defaultValue
 */
export function EmailField({errors, registerObject, defaultValue}){
    return (
        <FormField  errors={errors}>
            <input 
                placeholder="Correo electrónico"
                defaultValue    =   {defaultValue} 
                type            =   "text"
                name            =   {registerObject.name}
                id              =   {registerObject.name}
                maxLength       =   {BASE_EMAIL_MAX_LENGTH}
                {...registerObject}/>
        </FormField>
    )
}

EmailField.propTypes = {
    registerObject : PropTypes.object.isRequired,
    errors : PropTypes.string,
    defaultValue : PropTypes.string
}

EmailField.defaultProps = {
    errors : undefined,
    defaultValue : undefined,
}


