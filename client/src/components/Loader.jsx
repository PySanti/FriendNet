import "../styles/Loader.css"
import {useLoadingState} from "../store"
import {useEffect} from "react"

/**
 * Loader creado para mejorar la experiencia de usuario mientras se hace un llamado a api
 */
export function Loader(){
    /**
     * Recordar que el Loader siempre debe estar renderizado aun si no
     * tiene contenido, para que cuando lo empiece a tener, no se vea una 
     * modificacion de espacio en el DOM
     */
    const baseClass = "state-msg"
    const [loadingState, setLoadingState] = useLoadingState((state)=>([state.loadingState, state.setLoadingState]))
    useEffect(()=>{
        setLoadingState(false)
    }, [])
    return (
        <div className="state-container">
            <h2 className={loadingState ? `${baseClass} state-activated` : baseClass}>{loadingState}</h2>
        </div>
    )
}
