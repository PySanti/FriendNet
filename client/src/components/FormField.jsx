import { InputError } from "./InputError";
import {PropTypes} from "prop-types"
import { Label } from "./Label";
import "../styles/FormField.css"
/**
 * Componente creado para simplficar codigo de campos de Input. Wrapper de InputError, Label e inputs en si
 * @param {String} errors errores producidos por hook de manejo de errores de formulario
 * @param {String} label etiqueta de input
 * @param {ReactElement} children 
 */
export function FormField({errors, label, children}){
    return (
        <div className="form-field-container">
            <InputError msg={errors}/>
            <div className="input-pair-container">
                {label && <Label msg={label}/>}
                {children}
            </div>
        </div>
    )
}
FormField.propTypes = {
    children : PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    errors : PropTypes.string,
    label : PropTypes.string,
}

FormField.defaultProps = {
    errors : undefined,
    label : undefined,
}


