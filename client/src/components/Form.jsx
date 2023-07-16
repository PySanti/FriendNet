import "../styles/Form.css"
import { Button } from "./Button"
import {PropTypes} from "prop-types"
/**
 * 
 * @param {import("react").ComponentElement} children hijos del formulario
 * @param {Function}  onSubmitFunction funcion que se ejecutara cuando se envie el formulario
 * @param {String} buttonMsg mensaje de button de submit
 */
export function Form({children, onSubmitFunction, buttonMsg}){
    return (
        <form className="form-container" onSubmit={onSubmitFunction}>
            {children}
            <Button buttonText={buttonMsg} isSubmit/>
        </form>
    )
}


Form.propTypes = {
    children : PropTypes.object.isRequired,
    onSubmitFunction : PropTypes.func.isRequired,
    buttonMsg : PropTypes.string.isRequired
}

