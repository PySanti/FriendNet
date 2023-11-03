import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useState } from "react";
import { UserData } from "../components/UserData";
import { UserInfoForm } from "../components/UserInfoForm";
import { updateUserDataAPI } from "../api/updateUserData.api";
import { UserPhoto } from "../components/UserPhoto";
import { Button } from "../components/Button";
import "../styles/Profile.css";
import { v4 } from "uuid";
import { saveUserDataInLocalStorage } from "../utils/saveUserDataInLocalStorage";
import { getUserDataFromLocalStorage } from "../utils/getUserDataFromLocalStorage";
import { dataIsDiferent } from "../utils/dataIsDiferent";
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeApi} from "../utils/executeApi"
import {useLoadingState} from "../store/loadingStateStore"

/**
 * Pagina creada para llevar perfil de usuario, tanto para
 * actualizacion como visualizacion
 */
export function Profile({ edit }) {
    let   [profileData, setProfileData]                         = useState(getUserDataFromLocalStorage());
    const [ startLoading, setLoadingState, successfullyLoaded ] = useLoadingState((state)=>([state.startLoading, state.setLoadingState, state.successfullyLoaded ]))
    const navigate = useNavigate();
    const onUpdate = async (data) => {
        startLoading();
        // el data.photo siempre sera: null, url de imagen actual, un archivo
        const sendingData = { ...data };
        if (dataIsDiferent(data, profileData)) { // lodash
            const response = await executeApi(async ()=>{
                return await updateUserDataAPI( sendingData, getJWTFromLocalStorage().access)
            }, navigate, setLoadingState)
            if (response){
                if (response.status == 200){
                    setProfileData(response.data.user_data_updated);
                    saveUserDataInLocalStorage(response.data.user_data_updated);
                    successfullyLoaded();
                } else if (response.status == 400){
                    setLoadingState({
                        "username_or_email_taken"   : "El usuario o el email ya están tomados !",
                        "cloudinary_error"          : "Error al subir la imagen a la nube!"
                    }[response.data.error])
                } else {
                    setLoadingState('Hubo un error actualizando tus datos !')
                }
            }
        } else {
            setLoadingState("Sin cambios");
        }
    };


    if (!userIsAuthenticated()) {
        return <UserNotLogged msg="No puedes acceder a tu perfil si aun no has iniciado sesión o no tienes cuenta"/>;
    } else {
        return (
            <div className="centered-container">
                <div className="profile-container">
                    <Header msg={edit ? "Editando perfil" : "Viendo perfil"} />
                    <div className="editing-container">
                        {edit ? 
                            <UserInfoForm userData={profileData} onFormSubmit={onUpdate} extraButtons={[<Button key={v4()} buttonText="Volver" onClickFunction={() => {navigate("/home/profile/")} }/>,]}/>
                            : 
                            <>
                                <UserData nonShowableAttrs={["is_active","id","photo_link",]} attrsTraductions={{"username": "Nombre de usuario","email": "Correo electrónico"}} />
                                <UserPhoto photoFile={profileData.photo_link} withInput={false} />
                                <div className="buttons-section">
                                    <Button buttonText="Editar Perfil" onClickFunction={() => {navigate("/home/profile/edit")}} />
                                    <Button buttonText="Volver" onClickFunction={() =>{navigate("/home/")}} />
                                    <Button buttonText="Modificar Contraseña" onClickFunction={() => {navigate("/home/profile/change_pwd")}} />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    edit: PropTypes.bool,
};
Profile.defaultProps = {
    edit: undefined,
};
