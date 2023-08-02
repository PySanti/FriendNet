import { FormField } from "./FormField";
import { PropTypes } from "prop-types";

/**
 * Componente creado para campos de edad del usuario
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {Object} defaultValue 
 */
export function AgeField({defaultValue, registerObject, errors}){
    return (
        <FormField label="Edad"  errors={errors}>
            <input
                defaultValue={defaultValue}
                type="text"
                id={registerObject.name}
                name={registerObject.name}
                {...registerObject}
            />
        </FormField>
    )
}

AgeField.propTypes = {
    registerObject : PropTypes.object.isRequired,
    errors : PropTypes.string,
    defaultValue : PropTypes.string
}

AgeField.defaultProps = {
    errors : undefined,
    defaultValue : undefined,
}