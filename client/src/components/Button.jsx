import "../styles/Button.css"
import {PropTypes} from "prop-types"
/**
 * Componente creado para almacenar todos los botones de la aplicacion
 * @param {String} buttonText contenido del Button
 * @param {Function} onClickFunction
 * @param {Boolean} isSubmit sera true en caso de que sea un button de formulario
 */
export function Button({buttonText, onClickFunction, isSubmit}){
    const baseClassName = "button "
    return (
        <div className="button-container">
            <button 
                className={isSubmit ? baseClassName+" submit-button" : baseClassName} 
                type={isSubmit && "submit"}
                onClick={!isSubmit ? onClickFunction : null}>{buttonText}</button>
        </div>
    )
}

Button.propTypes = {
    buttonText : PropTypes.string.isRequired,
    onClickFunction : PropTypes.func,
    isSubmit : PropTypes.bool
}
Button.defaultProps = {
    onClickFunction : undefined,
    isSubmit : undefined
}