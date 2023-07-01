import {useNavigate } from "react-router-dom";
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
import { UserForm } from "../components/UserForm";
import {updateUserDataAPI} from "../api/updateUserData.api"
import { postCloudinaryImgAPI } from "../api/postCloudinaryImg.api";


export function Profile({updating}){
    let [backToHome, setBackToHome] = useState(false)
    const [editProfile, setEditProfile] = useState(false)
    let [photoChanged, setPhotoChanged] = useState(false)
    let [backToProfile, setBackToProfile] = useState(false)
    let     {loading, unExpectedError, handleUnExpectedError, startLoading, setLoading, nullSubmitStates} = useContext(SubmitStateContext)
    const   {user} = useContext(AuthContext)
    const   {profileData,loadProfileData, setProfileData} = useContext(ProfileContext)
    const   navigate = useNavigate()
    const   headerMsg = updating? "Editando perfil" : "Viendo perfil"
    useEffect(()=>{
        console.log('Montando')
        nullSubmitStates()
        if (userIsAuthenticated()){
            startLoading(true)
            loadProfileData(user.username, handleUnExpectedError)
            setLoading(false)
        }
    }, [])
    useEffect(()=>{
        if (backToHome){
            navigate('/home/')
            setBackToHome(false)
        }
    }, [backToHome])
    useEffect(()=>{
        if (editProfile){
            navigate('/home/profile/edit')
            setEditProfile(false)
        }
    }, [editProfile])
    useEffect(()=>{
        if(backToProfile){
            navigate('/home/profile/')
            setBackToProfile(false)
        }
    }, [backToProfile])
    useEffect(()=>{
        if(photoChanged){
            console.log('La foto cambio')
        }
    }, [photoChanged])
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
            await updateUserDataAPI(data, profileData.id)
            data.id = profileData.id
            data.is_active = profileData.is_active
            setProfileData(data)
        } catch(error){
            console.log(error)
            handleUnExpectedError("Error inesperado al actualizar datos del usuario!")
        }
    }

    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else{
        return (<>
                <Header username={user.username} msg={headerMsg}/>
                {unExpectedError && <UnExpectedError message={unExpectedError}/>}
                {loading && <Loading/>}
                {profileData && (
                    <div className="editing-container">
                        <img href={profileData.photo_link}/>
                        {updating && <UserForm updating={true}  onSubmitFunction={onUpdate} userData={profileData} onPhotoChange={()=>setPhotoChanged(true)}/> }
                        {!updating && <FormatedUserData userData={profileData}/>}
                    </div>
                )}
                {!updating &&(
                    <>
                        <button onClick={()=>setEditProfile(true)}>editar perfil</button>
                        <button onClick={()=>setBackToHome(true)}>Volver</button>
                    </>
                )}
                {updating &&(
                    <>
                        <button onClick={()=>setBackToProfile(true)}>Volver</button>
                    </>
                )}
        </>)
}}

