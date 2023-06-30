import { createContext, useState, useEffect } from "react";
export const SubmitStateContext = createContext()

export function SubmitStateContextProvider({children}){
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
    return (
        <SubmitStateContext.Provider value={context}>
            {children}
        </SubmitStateContext.Provider>
    )
}



