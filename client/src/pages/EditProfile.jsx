import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { UserForm } from "../components/UserForm";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import {  useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UnExpectedError } from "../components/UnExpectedError";
import { Loading } from "../components/Loading";
import { SubmitStateContext } from "../context/SubmitStateContext";
import { updateUserDataAPI } from "../api/updateUserData.api";
import { postCloudinaryImgAPI } from "../api/postCloudinaryImg.api";
import { ProfileContext } from "../context/ProfileContext";
export function EditProfile(){
    let {loading, unExpectedError, handleUnExpectedError, startLoading, setLoading, nullSubmitStates} = useContext(SubmitStateContext)
    const {user} = useContext(AuthContext)
    const {profileData,setProfileData, loadProfileData} = useContext(ProfileContext)
    let [photoChanged, setPhotoChanged] = useState(false)
    let [backToProfile, setBackToProfile] = useState(false)
    const navigate = useNavigate()

    const onUpdate = async (data)=>{
        startLoading(true)
        try{
            const photo = data['photo']
            delete data['photo']
            data['photo_link'] = profileData.photo_link
            if (photoChanged){
                const uploadedImgData           = await postCloudinaryImgAPI(photo)
                data['photo_link']              = uploadedImgData.data.url // el serializer el backend recibe photo_link, no la foto en si
            }
            const response = await updateUserDataAPI(data, profileData.id)
            data.id = profileData.id
            data.is_active = profileData.is_active
            setProfileData(data)
        } catch(error){
            handleUnExpectedError("Error inesperado al actualizar datos del usuario!")
        }
    }
    useEffect(()=>{
        if(backToProfile){
            navigate('/home/profile/')
        }
    }, [backToProfile])
    useEffect(()=>{
        nullSubmitStates()
        if (userIsAuthenticated()){
            startLoading(true)
            loadProfileData(user.username, handleUnExpectedError)
            setLoading(false)
        }
    }, [])
    useEffect(()=>{
        if (photoChanged){
            console.log('La foto cambio')
        }
    }, [photoChanged])
    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else{
        return <>
            <Header username={user.username}msg="Editando perfil"/>
            {unExpectedError && <UnExpectedError message={unExpectedError}/>}
            {loading && <Loading/>}
            {profileData && (
                <div className="editing-container">
                    <img href={profileData.photo_link}/>
                    <UserForm updating={true}  onSubmitFunction={onUpdate} userData={profileData} onPhotoChange={()=>setPhotoChanged(true)}/> 
                </div>
            )}
            <button onClick={()=>setBackToProfile(true)}>Volver</button>
        </>
    }
}