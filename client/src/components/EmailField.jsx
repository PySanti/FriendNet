import { FormField } from "./FormField";
import {PropTypes} from "prop-types"
/**
 * Componente creado para campos de email
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 */
export function EmailField({errors, registerObject, defaultValue, label}){
    return (
        <FormField label={label} errors={errors}>
            <input defaultValue={defaultValue ? defaultValue : null} type="text"name="email"id="email" {...registerObject}/>
        </FormField>
    )
}

EmailField.propTypes = {
    registerObject : PropTypes.object.isRequired,
    label : PropTypes.string.isRequired,
    errors : PropTypes.string,
    defaultValue : PropTypes.string
}

EmailField.defaultProps = {
    errors : undefined,
    defaultValue : undefined,
}


