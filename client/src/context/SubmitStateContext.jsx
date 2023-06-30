import { createContext, useEffect, useState } from "react";
export const SubmitStateContext = createContext()

export function SubmitStateContextProvider({children}){
    /**
     * Context creado para estandarizar el manejo de estados
     * en componentes que hagan solicitudes a api. Existiran
     * dos states: loading y unExpectedError. Ambos no pueden
     * ser true al mismo tiempo.
     */
    let [unExpectedError, setUnExpectedError]           = useState(null)
    let [loading, setLoading]                           = useState(false)
    const handleUnExpectedError = (error)=>{
        setLoading(false)
        setUnExpectedError(error)
    }
    const startLoading = ()=>{
        setLoading(true)
        setUnExpectedError(false)
    }
    const context = {
        startLoading : startLoading,
        handleUnExpectedError : handleUnExpectedError,
        loading : loading,
        unExpectedError : unExpectedError,
        setLoading : setLoading,
        setUnExpectedError: setUnExpectedError
    }
    useEffect(() => {
        // anulara los states cada vez que se use el context
        setLoading(false)
        setLoading(null)
    }, [])
    
    return (
        <SubmitStateContext.Provider value={context}>
            {children}
        </SubmitStateContext.Provider>
    )
}



