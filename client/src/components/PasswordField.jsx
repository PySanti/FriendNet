import { FormField } from "./FormField";
import {PropTypes} from "prop-types"

/**
 * Componente creado para campos de contrasenia
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {String} name nombre de input dentro de contexto del useForm
 * @param {String} label
 */
export function PasswordField({errors, registerObject, name, label}){
    return (
        <FormField label={label} errors={errors}>
            <input className="password-input" type="password" name={name} {...registerObject}/>
        </FormField>
    )
}

PasswordField.propTypes = {
    errors : PropTypes.string.isRequired,
    name : PropTypes.string.isRequired,
    label : PropTypes.string.isRequired,
    registerObject : PropTypes.object.isRequired,
}


