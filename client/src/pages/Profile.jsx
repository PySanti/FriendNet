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
import { UserForm } from "../components/UserForm";
import {updateUserDataAPI} from "../api/updateUserData.api"
import { SuccessUpdating } from "../components/SuccesUpdating";
import { saveCloudinary } from "../tools/saveCloudinary";
import { getUserDetailAPI } from "../api/getUserDetailApi.api";


export function Profile({updating}){
    // states
    let [profileData, setProfileData ] = useState(null)
    let     [backToHome, setBackToHome]                         = useState(false)
    let     [editProfile, setEditProfile]                       = useState(false)
    let     [photoChanged, setPhotoChanged]                     = useState(false)
    let     [backToProfile, setBackToProfile]                   = useState(false)
    let     [userUpdatedSuccesfully, setUserUpdatedSuccesfully] = useState(false)
    let     {loading, unExpectedError, handleUnExpectedError, startLoading, setLoading, nullSubmitStates} = useContext(SubmitStateContext)
    const   {user} = useContext(AuthContext)
    const   navigate = useNavigate()
    const   headerMsg = updating? "Editando perfil" : "Viendo perfil"
    const loadProfileData = async (username,  unExpectedErrorHandler)=>{
        if (!profileData){
            try{
                console.log('Cargando datos del usuario')
                const response = await getUserDetailAPI(username)
                setProfileData(await response.data)
                console.log('Llamando a api para carga de datos de perfil en context')
            } catch(error){
                unExpectedErrorHandler("Error inesperado en repuesta de api userDetail!")
            }
        }
    }
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
        if(userUpdatedSuccesfully){
            setLoading(false)
        }
    }, [userUpdatedSuccesfully])
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
            // borrar profile context
            const photo = data['photo']
            delete data['photo']
            data['photo_link'] = photoChanged ? saveCloudinary(photo) : profileData.photo_link
            const sendingData = data
            data.id = profileData.id
            data.is_active = profileData.is_active
            if (JSON.stringify(profileData) !== JSON.stringify(data)){ // lodash
                await updateUserDataAPI(sendingData, profileData.id)
                setProfileData(data)
                setUserUpdatedSuccesfully(true)
            } else {
                handleUnExpectedError("Sin cambios")
            }
        } catch(error){
            console.log(error)
            handleUnExpectedError("Error inesperado al actualizar datos del usuario!")
        }
    }
    // eliminar ProfileContext
    // agregar mensaje de success
    // modularizar maas


    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else{
        return (<>
                <Header username={user.username} msg={headerMsg}/>
                {unExpectedError && <UnExpectedError message={unExpectedError}/>}
                {loading && <Loading/>}
                {userUpdatedSuccesfully && <SuccessUpdating/>}
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

