import { FormField } from "./FormField";
import {PropTypes} from "prop-types"
import "../styles/PasswordField.css"
import { useState } from "react";

/**
 * Componente creado para campos de contrasenia
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {String} label
 */
export function PasswordField({errors, registerObject, label}){
    let [previsualizationActivated, setPrevisualizationActivated] = useState(false)
    return (
        <FormField  errors={errors}>
            <input 
                placeholder={label}
                className="password-input" 
                type={previsualizationActivated ? "text" : "password"} 
                name={registerObject.name} 
                {...registerObject}/>
            <div className="password-visualization" onClick={()=>setPrevisualizationActivated(!previsualizationActivated)}>
                <i className="material-symbols-outlined" >{previsualizationActivated ? "Visibility" : "Visibility_Off"}</i>
            </div>
        </FormField>
    )
}

PasswordField.propTypes = {
    errors : PropTypes.string,
    label : PropTypes.string.isRequired,
    registerObject : PropTypes.object.isRequired,
}

PasswordField.defaultValues = {
    errors : undefined
}

