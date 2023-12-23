import "../styles/Button.css"
import {PropTypes} from "prop-types"
/**
 * Componente creado para almacenar todos los botones de la aplicacion
 * @param {String} buttonText contenido del Button
 * @param {Function} onClickFunction
 * @param {Boolean} isSubmit sera true en caso de que sea un button de formulario
 * @param {Boolean} button_hovered
 */
export function Button({buttonText, onClickFunction, isSubmit, button_hovered}){
    return (
        <div className="button-container">
            <button className={button_hovered ? "button button_hovered" : "button"}type={isSubmit ? "submit" : "button"} onClick={!isSubmit ? onClickFunction : null}>
                {buttonText}
            </button>
        </div>
    )
}

Button.propTypes = {
    buttonText : PropTypes.string.isRequired,
    onClickFunction : PropTypes.func,
    isSubmit : PropTypes.bool,
    button_hovered : PropTypes.bool
}
Button.defaultProps = {
    onClickFunction : undefined,
    isSubmit : undefined
}
