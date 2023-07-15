import "../styles/Loader.css"
/**
 * Loader creado para mejorar la experiencia de usuario mientras se hace un llamado a api
 * @param {String} state estado de llamada (failed, loading, success)
 */
export function Loader({state}){
    /**
     * Recordar que el Loader siempre debe estar renderizado aun si no
     * tiene contenido, para que cuando lo empiece a tener, no se vea una 
     * modificacion de espacio en el DOM
     */
    const baseClass = "state-msg"
    return (
        <div className="state-container">
            <h2 className={state ? baseClass + " state-activated" : baseClass}>{state}</h2>
        </div>
    )
}