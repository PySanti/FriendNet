/**
 * Loader creado para mejorar la experiencia de usuario mientras se hace un llamado a api
 * @param {String} state estado de llamada (failed, loading, success)
 */
export function Loader({state}){
    return (
        <div className="state-container">
            {state && 
                <h2>
                    {state==="failed"&&"Error"}
                    {state==="success"&&"Exito"}
                    {state==="loading"&&"Cargando"}
                </h2>
            }
        </div>
    )
}