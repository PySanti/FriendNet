import { FormField } from "./FormField";

/**
 * Componente creado para campos de contrasenia
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {String} name nombre de input dentro de contexto del useForm
 * @param {String} label
 */
export function PasswordField({errors, registerObject, name, label}){
    return (
        <FormField label={label} errors={errors}>
            <input className="password-input" type="password" name={name} {...registerObject}/>
        </FormField>
    )
}