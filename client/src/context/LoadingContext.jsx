import { createContext,  useState } from "react";
export const LoadingContext = createContext()

/**
 * Context creado para estandarizar el manejo de estados
 * en componentes que hagan solicitudes a api. Existiran
 * dos states: loading y success. Ambos no pueden
 * ser true al mismo tiempo. En caso de que no sea ningun estado, 
 * entonces contendra un mensaje de error
 */
export function LoadingContextProvider({children}){
    let [loadingState, setLoadingState] = useState(false)
    const successfullyLoaded = ()=>{
        setLoadingState("success")
    }
    const startLoading = ()=>{
        setLoadingState("loading")
    }
    const context = {
        setLoadingState : setLoadingState,
        loadingState : loadingState,
        successfullyLoaded : successfullyLoaded,
        startLoading : startLoading
    }
    return (
        <LoadingContext.Provider value={context}>
            {children}
        </LoadingContext.Provider>
    )
}



