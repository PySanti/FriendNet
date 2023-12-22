import { InputError } from "./InputError";
import {PropTypes} from "prop-types"
import "../styles/FormField.css"
/**
 * Componente creado para simplficar codigo de campos de Input. Wrapper de InputError, Label e inputs en si
 * @param {String} errors errores producidos por hook de manejo de errores de formulario
 * @param {ReactElement} children 
 */
export function FormField({errors,  children}){
    return (
        <div className="form-field-container">
            <InputError msg={errors}/>
            <div className="input-pair-container">
                {children}
            </div>
        </div>
    )
}
FormField.propTypes = {
    children : PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    errors : PropTypes.string,
}

FormField.defaultProps = {
    errors : undefined,
}


