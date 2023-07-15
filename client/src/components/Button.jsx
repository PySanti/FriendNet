import "../styles/Button.css"
/**
 * Componente creado para almacenar todos los botones de la aplicacion
 * @param {String} msg contenido del Button
 * @param {Function} onClickFunction
 * @param {Boolean} isSubmit sera true en caso de que sea un button de formulario
 */
export function Button({msg, onClickFunction, isSubmit}){
    const baseClassName = "button "
    return (
        <div className="button-container">
            {isSubmit ? 
            <button className={baseClassName+"submit-button"} type="submit">{msg}</button> 
            : 
            <button className={baseClassName} onClick={onClickFunction}>{msg}</button>}
        </div>
    )

}