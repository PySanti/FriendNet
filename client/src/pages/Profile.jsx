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
import { UserPhoto } from "../components/UserPhoto";
import { Button } from "../components/Button";
import "../styles/Profile.css"
import { v4 } from "uuid";
import { saveUserDataInLocalStorage } from "../utils/saveUserDataInLocalStorage";
import { getUserDataFromLocalStorage } from "../utils/getUserDataFromLocalStorage";
import { dataIsDiferent } from "../utils/dataIsDiferent";


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
    const loadProfileData = ()=>{
        startLoading()
        if (!profileData){
            try{
                setProfileData(getUserDataFromLocalStorage())
                successfullyLoaded()
            } catch(error){
                setLoadingState("Error inesperado al cargar datos del usuario desde el Local Storage")
            }
        } 
    }
    const onUpdate = async (data)=>{
        startLoading()
        try{
            if (!data.photo && profileData.photo_link){
                // en este caso, el usuario habria eliminado su foto
                data.image_delete = true
            }
            const sendingData = {...data}
            if (dataIsDiferent(data, profileData)){ // lodash
                if (sendingData.photo && sendingData.photo === profileData.photo_link){
                    sendingData.photo = null
                }
                const updateUserResponse = await updateUserDataAPI(sendingData, profileData.id)
                setProfileData(updateUserResponse.data.user_data_updated)
                saveUserDataInLocalStorage(updateUserResponse.data.user_data_updated)
                successfullyLoaded()
            } else {
                setLoadingState("Sin cambios")
            }
        } catch(error){
            if (error.response.data.error === "cloudinary_error"){
                setLoadingState("Error con la nube!")
            } else {
                setLoadingState("Error inesperado al actualizar datos del usuario!")
            }
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
                                    <UserPhoto photoFile={profileData.photo_link} withInput={false}/>
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