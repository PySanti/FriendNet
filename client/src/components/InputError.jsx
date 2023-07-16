import "../styles/InputError.css"
import {PropTypes} from "prop-types"
/**
 * Componente creado para contener mensajes de error en FromField's
 * @param {String} msg mensaje de error
 */
export function InputError({msg}){
    /**
     * Recordar que el input-error siempre debe estar renderizado aun si no
     * tiene contenido, para que cuando lo empiece a tener, no se vea una 
     * modificacion de espacio en el DOM
     */
    const baseClass = "input-error"
    return (
        <div className="input-error-container">
            <h2 className={msg ? baseClass+" input-error-activated" : baseClass}>{msg}</h2>
        </div>
    )
}

InputError.propTypes = {
    msg : PropTypes.string
}

InputError.defaultProps = {
    msg : undefined
}