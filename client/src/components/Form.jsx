import "../styles/Form.css"
import { Button } from "./Button"
import {PropTypes} from "prop-types"
/**
 * 
 * @param {import("react").ComponentElement} children hijos del formulario
 * @param {Function}  onSubmitFunction funcion que se ejecutara cuando se envie el formulario
 * @param {String} buttonMsg mensaje de button de submit
 * @param {Boolean} withSubmitButton sera true en caso de que se desee que el mismo componente rederice el button de submiting
 */
export function Form({children, onSubmitFunction, buttonMsg, withSubmitButton}){
    return (
        <form className="form-container" onSubmit={onSubmitFunction}>
            {children}
            {withSubmitButton && <Button buttonText={buttonMsg} isSubmit/>}
        </form>
    )
}


Form.propTypes = {
    children : PropTypes.array.isRequired,
    onSubmitFunction : PropTypes.func.isRequired,
    buttonMsg : PropTypes.string,
    withSubmitButton : PropTypes.bool
}
Form.defaultProps={
    buttonMsg : undefined,
    withSubmitButton : undefined
}

