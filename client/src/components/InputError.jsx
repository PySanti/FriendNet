/**
 * Componente creado para contener mensajes de error en FromField's
 * @param {String} msg mensaje de error
 */
export function InputError({msg}){
    return (
        <div className="input-error-container">
            {msg}
        </div>
    )
}