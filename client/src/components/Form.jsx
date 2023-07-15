import "../styles/Form.css"
import { Button } from "./Button"
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