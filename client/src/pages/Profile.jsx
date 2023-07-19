import {useNavigate } from "react-router-dom";
import {PropTypes} from "prop-types"
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserData } from "../components/UserData";
import { Loader } from "../components/Loader";
import { LoadingContext} from "../context/LoadingContext";
import { UserInfoForm } from "../components/UserInfoForm";
import {updateUserDataAPI} from "../api/updateUserData.api"
import { saveCloudinary } from "../utils/saveCloudinary";
import { getUserDetailAPI } from "../api/getUserDetailApi.api";
import {_}  from "lodash"
import { UserPhoto } from "../components/UserPhoto";
import { Button } from "../components/Button";
import "../styles/Profile.css"
import { v4 } from "uuid";
import { saveUserDataInLocalStorage } from "../utils/saveUserDataInLocalStorage";
import { getUserDataFromLocalStorage } from "../utils/getUserDataFromLocalStorage";


/**
 * Pagina creada para llevar perfil de usuario, tanto para
 * actualizacion como visualizacion
 */
export function Profile({updating}){
    // states
    let     [profileData, setProfileData ] = useState(null)
    let     [backToHome, setBackToHome]                         = useState(false)
    let     [editProfile, setEditProfile]                       = useState(false)
    let     [backToProfile, setBackToProfile]                   = useState(false)
    let     [changePwd, setChangePwd]                           = useState(false)
    let     {loadingState, startLoading, setLoadingState, successfullyLoaded} = useContext(LoadingContext)
    const   {user} = useContext(AuthContext)
    const   navigate = useNavigate()
    const loadProfileData = async ()=>{
        startLoading()
        if (!profileData){
            if (!localStorage.getItem('userData')){
                try{
                    const response = await getUserDetailAPI(user.username)
                    setProfileData(response.data)
                    saveUserDataInLocalStorage(response.data)
                    successfullyLoaded()
                } catch(error){
                    setLoadingState("Error inesperado en repuesta del servidor")
                }
            } else {
                setProfileData(getUserDataFromLocalStorage())
                setLoadingState('Datos cargados desde el local storage')
            }
        } 
    }
    const onUpdate = async (data)=>{
        startLoading()
        try{
            data['photo_link'] = data['photo'] ? await saveCloudinary(data['photo']) : profileData.photo_link
            delete data['photo']
            const sendingData = data
            // se prepara al data para la comparativa
            data.id = profileData.id
            data.is_active = profileData.is_active
            data.age = Number(data.age)
            if (!_.isEqual(profileData, data)){ // lodash
                await updateUserDataAPI(sendingData, profileData.id)
                setProfileData(data)
                saveUserDataInLocalStorage(data)
                successfullyLoaded()
            } else {
                setLoadingState("Sin cambios")
            }
        } catch(error){
            console.log(error)
            setLoadingState("Error inesperado al actualizar datos del usuario!")
        }
    }
    useEffect(()=>{
        setLoadingState(false)
        if (userIsAuthenticated()){
            loadProfileData()
        }
    }, [])
    useEffect(()=>{
        if(changePwd){
            navigate('/home/profile/change_pwd')
        }
    }, [changePwd])
    useEffect(()=>{
        if (backToHome){
            setBackToHome(false)
            navigate('/home/')
        }
    }, [backToHome])
    useEffect(()=>{
        if (editProfile){
            setEditProfile(false)
            navigate('/home/profile/edit')
        }
    }, [editProfile])
    useEffect(()=>{
        if(backToProfile){
            setBackToProfile(false)
            navigate('/home/profile/')
        }
    }, [backToProfile])
    // modularizar maas


    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else{
        return (
            <div className="centered-container">
                <div className="profile-container">
                    <Header username={user.username} msg={updating? "Editando perfil" : "Viendo perfil"}/>
                    <Loader state={loadingState}/>
                    {profileData            && 
                        <div className="editing-container">
                            {updating ? 
                                <UserInfoForm updating  onFormSubmit={onUpdate} userData={profileData}  userPhotoUrl={profileData.photo_link} extraButtons={[
                                    <Button key={v4()} buttonText="Volver" onClickFunction={()=>setBackToProfile(true)}/>
                                ]}/> 
                                :
                                <>
                                    <UserData userData={profileData} nonShowableAttrs={["is_active", "id", "photo_link"]} attrsTraductions={    {        "username" : "Nombre de usuario",         "email" : "Correo electrónico",         "first_names" : "Nombres",        "last_names" : "Apellidos",        "age" : "Edad",    }    }/>
                                    <UserPhoto url={profileData.photo_link} withInput={false}/>
                                </>
                            }
                        </div>
                    }
                    <div className="buttons-section">
                        {!updating &&
                            <>
                                <Button buttonText="Editar Perfil" onClickFunction={()=>setEditProfile(true)}/>
                                <Button buttonText="Volver" onClickFunction={()=>setBackToHome(true)}/>
                                <Button buttonText="Modificar Contraseña" onClickFunction={()=>setChangePwd(true)}/>
                            </>
                        }
                    </div>
            </div>
        </div>)
}}

Profile.propTypes = {
    updating : PropTypes.bool
}
Profile.defaultProps = {
    updating : undefined
}