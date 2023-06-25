import { createContext, useState } from "react";


export const AuthContext = createContext()

export function AuthContextProvider({children}){
    let [authTokens, setAuthTokens] = useState(null)
    let [user, setUser] = useState(null)
    const loginUser = async (formData) =>{

    }




    return (
        <AuthContext.Provider value={{'username' : 'Santi'}}>
            {children}
        </AuthContext.Provider>
    )
}