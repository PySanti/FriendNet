import { FormField } from "./FormField";
import {PropTypes} from "prop-types"
import "../styles/PasswordField.css"

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
            <button className="password-visualization" type="button"/>
        </FormField>
    )
}

PasswordField.propTypes = {
    errors : PropTypes.string,
    name : PropTypes.string.isRequired,
    label : PropTypes.string.isRequired,
    registerObject : PropTypes.object.isRequired,
}

PasswordField.defaultValues = {
    errors : undefined
}

