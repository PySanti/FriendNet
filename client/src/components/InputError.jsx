import "../styles/InputError.css"
/**
 * Componente creado para contener mensajes de error en FromField's
 * @param {String} msg mensaje de error
 */
export function InputError({msg}){
    return (
        <div className="input-error-container">
            {msg &&<h2 className="input-error input-error-activated">{msg}</h2>}
            {!msg &&<h2 className="input-error">{msg}</h2>}
        </div>
    )
}