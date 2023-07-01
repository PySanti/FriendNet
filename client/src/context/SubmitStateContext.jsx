import { createContext, useEffect, useState } from "react";
export const SubmitStateContext = createContext()

/**
 * Context creado para estandarizar el manejo de estados
 * en componentes que hagan solicitudes a api. Existiran
 * dos states: loading y unExpectedError. Ambos no pueden
 * ser true al mismo tiempo. Loading puede tener 3 estados (loading, success, failed)
 */
export function SubmitStateContextProvider({children}){

    let [unExpectedError, setUnExpectedError]           = useState(null)
    let [loadingState, setLoadingState]                 = useState(false)
    const handleUnExpectedError = (error)=>{
        setLoadingState("failed")
        setUnExpectedError(error)
    }
    const startLoading = ()=>{
        setLoadingState("loading")
        setUnExpectedError(false)
    }
    const successfullyLoaded = ()=>{
        setLoadingState("success")
        setUnExpectedError(false)
    }
    const nullSubmitStates = ()=>{
        /**
         * Anulara los estados para evitar que se encadenen
         * entre llamadas al contexto
         */
        setLoadingState(false)
        setUnExpectedError(null)
    }
    const context = {
        startLoading : startLoading,
        setLoadingState : setLoadingState,
        loadingState : loadingState,
        successfullyLoaded : successfullyLoaded,
        handleUnExpectedError : handleUnExpectedError,
        unExpectedError : unExpectedError,
        setUnExpectedError: setUnExpectedError,
        nullSubmitStates : nullSubmitStates
    }
    return (
        <SubmitStateContext.Provider value={context}>
            {children}
        </SubmitStateContext.Provider>
    )
}



