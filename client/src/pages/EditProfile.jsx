import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { UserForm } from "../components/UserForm";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserDetailAPI } from "../api/getUserDetailApi.api";
import { AuthContext } from "../context/AuthContext";
import { UnExpectedError } from "../components/UnExpectedError";
import { Loading } from "../components/Loading";
import { SubmitStateContext } from "../context/SubmitStateContext";
import { updateUserDataAPI } from "../api/updateUserData.api";
import { postCloudinaryImgAPI } from "../api/postCloudinaryImg.api";

export function EditProfile(){
    let {loading, unExpectedError, handleUnExpectedError, startLoading, setLoading, nullSubmitStates} = useContext(SubmitStateContext)
    const props  = useLocation().state
    const {user} = useContext(AuthContext)
    let [userData, setUserData] = useState(null)
    let [photoChanged, setPhotoChanged] = useState(false)
    let [backToProfile, setBackToProfile] = useState(false)
    const navigate = useNavigate()
    const loadUserData = async ()=>{
        if (!props){
            try{
                const response = await getUserDetailAPI(user.username)
                setUserData(await response.data)
            } catch(error){
                handleUnExpectedError("Error inesperado en repuesta de api userDetail!")
            }
        } else {
            console.log('Buscando datos en props')
            setUserData(props.userData)
        }
    }
    const onUpdate = async (data)=>{
        startLoading(true)
        try{
            const photo = data['photo']
            delete data['photo']
            data['photo_link'] = userData.photo_link
            if (photoChanged){
                const uploadedImgData           = await postCloudinaryImgAPI(photo)
                data['photo_link']              = uploadedImgData.data.url // el serializer el backend recibe photo_link, no la foto en si
            }
            const response = await updateUserDataAPI(data, userData.id)
            data.id = userData.id
            data.is_active = userData.is_active
            setUserData(data)
            props.userData = userData
            console.log(props.userData)
        } catch(error){
            handleUnExpectedError("Error inesperado al actualizar datos del usuario!")
        }
    }
    useEffect(()=>{
        if(backToProfile){
            navigate('/home/profile/', {state : {userData:userData}})
        }
    }, [backToProfile])
    useEffect(()=>{
        nullSubmitStates()
        if (userIsAuthenticated()){
            startLoading(true)
            loadUserData()
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
            {userData && (
                <div className="editing-container">
                    <img href={userData.photo_link}/>
                    <UserForm updating={true}  onSubmitFunction={onUpdate} userData={userData} onPhotoChange={()=>setPhotoChanged(true)}/> 
                </div>
            )}
            <button onClick={()=>setBackToProfile(true)}>Volver</button>
        </>
    }
}