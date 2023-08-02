import { FormField } from "./FormField";
import {PropTypes} from "prop-types"
/**
 * Componente creado para campos de email
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {String} defaultValue
 */
export function EmailField({errors, registerObject, defaultValue}){
    return (
        <FormField label="Correo electrónico" errors={errors}>
            <input 
                defaultValue    =   {defaultValue} 
                type            =   "text"
                name            =   {registerObject.name}
                id              =   {registerObject.name}
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


