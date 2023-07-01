
import { createContext, useState} from "react";
import { getUserDetailAPI } from "../api/getUserDetailApi.api";
export const ProfileContext = createContext()


export function ProfileContextProvider({children}){
    let [profileData, setProfileData ] = useState(null)
    const loadProfileData = async (username,  unExpectedErrorHandler)=>{
        console.log('Llamando a api para carga de datos de perfil en context')
        if (!profileData){
            try{
                const response = await getUserDetailAPI(username)
                setProfileData(await response.data)
            } catch(error){
                unExpectedErrorHandler("Error inesperado en repuesta de api userDetail!")
            }
        }

    }
    const context = {
        loadProfileData : loadProfileData,
        setProfileData : setProfileData,
        profileData : profileData
    }
    return (
        <ProfileContext.Provider value={context}>
            {children}
        </ProfileContext.Provider>
    )
}

