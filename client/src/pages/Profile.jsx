import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FormatedUserData } from "../components/FormatedUserData";
import { UnExpectedError } from "../components/UnExpectedError";
import { Loading } from "../components/Loading";
import { SubmitStateContext } from "../context/SubmitStateContext";
import { ProfileContext } from "../context/ProfileContext";


export function Profile(){
    let [backToHome, setBackToHome] = useState(false)
    let {loading, unExpectedError, handleUnExpectedError, startLoading, setLoading, nullSubmitStates} = useContext(SubmitStateContext)
    const {user} = useContext(AuthContext)
    const {profileData,loadProfileData} = useContext(ProfileContext)
    const navigate = useNavigate()
    const [editProfile, setEditProfile] = useState(false)

    useEffect(()=>{
        if (backToHome){
            navigate('/home/')
        }
    }, [backToHome])
    useEffect(()=>{
        nullSubmitStates()
        if (userIsAuthenticated()){
            startLoading()
            loadProfileData(user.username, handleUnExpectedError)
            setLoading(false)
        }
    }, [])
    useEffect(()=>{
        if (editProfile){
            navigate('/home/profile/edit')
        }
    }, [editProfile])
    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else{
        return ( 
            <>
                <Header username={user.username} msg="Viendo perfil"/>
                {unExpectedError && <UnExpectedError message={unExpectedError}/>}
                {loading && <Loading/>}
                {profileData && (
                    <div className="user-data-container">
                        <img href={profileData.photo_link} />
                        <FormatedUserData userData={profileData}/>
                    </div>
                )}
                <button onClick={()=>setEditProfile(true)}>editar perfil</button>
                <button onClick={()=>setBackToHome(true)}>Volver</button>
            </>
        )
    } 
}