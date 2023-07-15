import "../styles/Loader.css"
/**
 * Loader creado para mejorar la experiencia de usuario mientras se hace un llamado a api
 * @param {String} state estado de llamada (failed, loading, success)
 */
export function Loader({state}){
        /**
     * Recordar que el input-error siempre debe estar renderizado aun si no
     * tiene contenido, para que cuando lo empiece a tener, no se vea una 
     * modificacion de espacio en el DOM
     */
    return (
        <div className="state-container">
            {state &&      <h2 className="state-msg state-activated">{state}</h2>}
            {!state &&      <h2 className="state-msg"></h2>}
        </div>
    )
}