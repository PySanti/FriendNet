import { FormField } from "./FormField";
import { BASE_USERNAME_MAX_LENGTH } from "../utils/constants";
import {PropTypes} from "prop-types"
/**
 * Componente creado para campos de nombre de usuario
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {Object} defaultValue 
 */
export function UsernameField({errors, registerObject, defaultValue}){
    return (
        <FormField label="Usuario" errors={errors}>
            <input 
                defaultValue={defaultValue ? defaultValue : null} 
                type="text"
                name={registerObject.name}
                id={registerObject.name}
                maxLength={BASE_USERNAME_MAX_LENGTH} 
                {...registerObject}/>
        </FormField>
    )
}

UsernameField.propTypes = {
    defaultValue : PropTypes.string,
    errors : PropTypes.string,
    registerObject : PropTypes.object,
}

UsernameField.defaultProps = {
    errors : undefined,
    defaultValue : undefined,
}
