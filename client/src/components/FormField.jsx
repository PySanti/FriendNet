import { InputError } from "./InputError";
import { Label } from "./Label";
import "../styles/FormField.css"
/**
 * Componente creado para simplficar codigo de campos de Input
 * @param {String} errors errores producidos por hook de manejo de errores de formulario
 * @param {String} label etiqueta de input
 * @param {ReactElement} children input perse
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