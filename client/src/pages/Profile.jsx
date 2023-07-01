import {useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FormatedUserData } from "../components/FormatedUserData";
import { UnExpectedError } from "../components/UnExpectedError";
import { Loader } from "../components/Loader";
import { SubmitStateContext } from "../context/SubmitStateContext";
import { UserForm } from "../components/UserForm";
import {updateUserDataAPI} from "../api/updateUserData.api"
import { saveCloudinary } from "../tools/saveCloudinary";
import { getUserDetailAPI } from "../api/getUserDetailApi.api";
import {_}  from "lodash"
import { UserPhoto } from "../components/UserPhoto";


/**
 * Pagina creada para llevar perfil de usuario, tanto para
 * actualizacion como visualizacion
 */
export function Profile({updating}){
    // states
    let [profileData, setProfileData ] = useState(null)
    let     [backToHome, setBackToHome]                         = useState(false)
    let     [editProfile, setEditProfile]                       = useState(false)
    let     [photoChanged, setPhotoChanged]                     = useState(false)
    let     [backToProfile, setBackToProfile]                   = useState(false)
    let     {
        loadingState, 
        unExpectedError, 
        handleUnExpectedError, 
        startLoading, 
        setLoadingState, 
        nullSubmitStates,
        successfullyLoaded} = useContext(SubmitStateContext)
    const   {user} = useContext(AuthContext)
    const   navigate = useNavigate()
    const   headerMsg = updating? "Editando perfil" : "Viendo perfil"
    const loadProfileData = async (username,  unExpectedErrorHandler)=>{
        if (!profileData){
            try{
                const response = await getUserDetailAPI(username)
                setProfileData(response.data)
            } catch(error){
                unExpectedErrorHandler("Error inesperado en repuesta del servidor")
            }
        }
    }
    const onUpdate = async (data)=>{
        startLoading()
        try{
            const photo = data['photo']
            delete data['photo']
            console.log(profileData)
            data['photo_link'] = photoChanged ? await saveCloudinary(photo) : profileData.photo_link
            setPhotoChanged(false)
            const sendingData = data
            // se prepara al data para la comparativa
            data.id = profileData.id
            data.is_active = profileData.is_active
            data.age = Number(data.age)
            if (!_.isEqual(profileData, data)){ // lodash
                await updateUserDataAPI(sendingData, profileData.id)
                setProfileData(data)
                successfullyLoaded()
            } else {
                handleUnExpectedError("Sin cambios")
            }
        } catch(error){
            console.log(error)
            handleUnExpectedError("Error inesperado al actualizar datos del usuario!")
        }
    }
    useEffect(()=>{
        nullSubmitStates()
        if (userIsAuthenticated()){
            startLoading()
            loadProfileData(user.username, handleUnExpectedError)
            setLoadingState(false)
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
            nullSubmitStates()
            navigate('/home/profile/edit')
            setEditProfile(false)
        }
    }, [editProfile])
    useEffect(()=>{
        if(backToProfile){
            nullSubmitStates()
            navigate('/home/profile/')
            setBackToProfile(false)
        }
    }, [backToProfile])
    // modularizar maas


    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else{
        return (<>
                <Header username={user.username} msg={headerMsg}/>
                {unExpectedError        && <UnExpectedError msg={unExpectedError}/>}
                {loadingState           && <Loader state={loadingState}/>}
                {profileData            && (
                    <div className="editing-container">
                        <UserPhoto url={profileData.photo_link} />
                        {updating && <UserForm updating={true}  onSubmitFunction={onUpdate} userData={profileData} onPhotoChange={()=>setPhotoChanged(true)}/> }
                        {!updating && 
                        <FormatedUserData 
                        userData={profileData} 
                        non_showable_attrs={["is_active", "id", "photo_link"]} 
                        attrs_traductions={
                            {
                                "username" : "Nombre de usuario", 
                                "email" : "Correo electrónico", 
                                "first_names" : "Nombres",
                                "last_names" : "Apellidos",
                                "age" : "Edad",
                            }
                            }/>}
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

