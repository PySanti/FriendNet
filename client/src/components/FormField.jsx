import { InputError } from "./InputError";
import { Label } from "./Label";
import { ReactElement } from "react";

/**
 * Componente creado para simplficar codigo de campos de Input
 * @param {String} errors errores producidos por hook de manejo de errores de formulario
 * @param {String} label etiqueta de input
 * @param {ReactElement} children input perse
 */
export function FormField({errors, label, children}){
    return (
        <div className="form-field-container">
            {errors && <InputError msg={errors}/>}
            {label && <Label msg={label}/>}
            {children}
        </div>
    )
}