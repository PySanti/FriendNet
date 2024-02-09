import { FormField } from "./FormField";
import {PropTypes} from "prop-types"

/**
 * Componente creado para campos de activationCode
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 */
export function CodeField({errors, registerObject}){
    return (
        <FormField errors={errors}>
            <input
                placeholder="Código"
                type        =   "text"
                maxLength   =   {6}
                name        =   {registerObject.name}
                id          =   {registerObject.name}
                {...registerObject}/>
        </FormField>
    )
}

CodeField.propTypes = {
    registerObject : PropTypes.object.isRequired,
    errors : PropTypes.string,
}

CodeField.defaultProps = {
    errors : undefined,
}



