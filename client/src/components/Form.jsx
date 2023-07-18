import "../styles/Form.css"
import { Button } from "./Button"
import {PropTypes} from "prop-types"
/**
 * 
 * @param {import("react").ComponentElement} children hijos del formulario
 * @param {Function}  onSubmitFunction funcion que se ejecutara cuando se envie el formulario
 * @param {String} buttonMsg mensaje de button de submit
 * @param {Array} buttonsList sera una lista de buttons que se deseen renderizar junto al submit button
 */
export function Form({children, onSubmitFunction, buttonMsg, buttonsList}){
    return (
        <form className="form-container" onSubmit={onSubmitFunction}>
            {children}
            <div className="form-container-buttons-container">
                {buttonsList}
                <Button buttonText={buttonMsg} isSubmit/>
            </div>
        </form>
    )
}


Form.propTypes = {
    children : PropTypes.array.isRequired,
    onSubmitFunction : PropTypes.func.isRequired,
    buttonMsg : PropTypes.string,
    buttonsList : PropTypes.array
}
Form.defaultProps={
    buttonMsg : undefined,
    buttonsList : undefined
}

