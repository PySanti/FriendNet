import "../styles/InputError.css"
/**
 * Componente creado para contener mensajes de error en FromField's
 * @param {String} msg mensaje de error
 */
export function InputError({msg}){
    const cls = "input-error"
    /**
     * Recordar que el input-error siempre debe estar renderizado aun si no
     * tiene contenido, para que cuando lo empiece a tener, no se vea una 
     * modificacion de espacio en el DOM
     */
    return (
        <div className="input-error-container">
            {msg ? 
                <h2 className={cls+" input-error-activated"}>{msg}</h2>
                :
                <h2 className={cls}>{msg}</h2>
            }
        </div>
    )
}