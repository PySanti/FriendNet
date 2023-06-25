import { createContext } from "react";


export const AuthContext = createContext()

export function AuthContextProvider({children}){
    return (
        <AuthContext.Provider value={{'username' : 'Santi'}}>
            {children}
        </AuthContext.Provider>
    )
}