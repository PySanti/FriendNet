import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useState } from "react";
import { UserInfoForm } from "../components/UserInfoForm";
import { updateUserDataAPI } from "../api/updateUserData.api";
import { Button } from "../components/Button";
import "../styles/Profile.css";
import { v4 } from "uuid";
import { saveUserDataInLocalStorage } from "../utils/saveUserDataInLocalStorage";
import { getUserDataFromLocalStorage } from "../utils/getUserDataFromLocalStorage";
import { dataIsDiferent } from "../utils/dataIsDiferent";
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeApi} from "../utils/executeApi"
import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"
import {useLoadingState} from "../store"

/**
 * Pagina creada para llevar perfil de usuario, tanto para
 * actualizacion como visualizacion
 */
export function Profile() {
    let   [profileData, setProfileData]                         = useState(getUserDataFromLocalStorage());
    const [ startLoading, setLoadingState, successfullyLoaded ] = useLoadingState((state)=>([state.startLoading, state.setLoadingState, state.successfullyLoaded ]))
    const navigate = useNavigate();
    const onUpdate = async (data) => {
        // el data.photo siempre sera: null, url de imagen actual, un archivo
        const sendingData = { ...data };
        if (dataIsDiferent(data, profileData)) { // lodash
            toast.loading('Modificando perfil')
            const response = await executeApi(async ()=>{
                return await updateUserDataAPI( sendingData, getJWTFromLocalStorage().access)
            }, navigate)
            if (response){
                if (response.status == 200){
                    setProfileData(response.data.user_data_updated);
                    saveUserDataInLocalStorage(response.data.user_data_updated);
                    successfullyLoaded();
                } else if (response.status == 400){
                    const log = {
                        "username_or_email_taken"   : "¡ El usuario o el email ya están tomados !",
                        "cloudinary_error"          : "¡ Error al subir la imagen a la nube !"
                    }[response.data.error]
                    setLoadingState(log ? log : '¡ Hubo un error actualizando tus datos !')
                } else {
                    setLoadingState('¡ Hubo un error actualizando tus datos !')
                }
            }
        } else {
            setLoadingState("Sin cambios");
        }
    };
    useEffect(()=>{
        document.title = generateDocumentTitle("Perfil")
    }, [])
    if (!userIsAuthenticated()) {
        return <UserNotLogged msg="No puedes acceder a tu perfil si aun no has iniciado sesión o no tienes cuenta"/>;
    } else {
        return (
            <div className="centered-container">
                <div className="profile-container">
                    <Header msg="Editando perfil" />
                    <div className="editing-container">
                        <UserInfoForm 
                            userData={profileData} 
                            onFormSubmit={onUpdate} 
                            extraButtons={[
                                <Button key={v4()} back onClickFunction={() => {navigate("/home/")} }/>,
                                <Button key={v4()} buttonText="Modificar Contraseña" onClickFunction={() => {navigate("/home/profile/change_pwd/")} }/>,
                                ]}/>
                    </div>
                </div>
            </div>
        );
    }
}


