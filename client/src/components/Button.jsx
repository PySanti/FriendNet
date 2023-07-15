import "../styles/Button.css"
/**
 * Componente creado para almacenar todos los botones de la aplicacion
 * @param {String} msg contenido del Button
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
                onClick={!isSubmit && onClickFunction}>{buttonText}</button>
        </div>
    )

}