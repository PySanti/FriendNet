/**
 * Creado para renderizar mensaje de error inesperado en DOM
 * @param {String} msg mensaje de error
 */
export function UnExpectedError({msg}){
    return (
        <div className="un-expected-error-container">
            {msg && msg}
        </div>
    )
}