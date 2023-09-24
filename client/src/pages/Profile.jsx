import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useContext, useState } from "react";
import { UserData } from "../components/UserData";
import { Loader } from "../components/Loader";
import { LoadingContext } from "../context/LoadingContext";
import { UserInfoForm } from "../components/UserInfoForm";
import { updateUserDataAPI } from "../api/updateUserData.api";
import { UserPhoto } from "../components/UserPhoto";
import { Button } from "../components/Button";
import "../styles/Profile.css";
import { v4 } from "uuid";
import { saveUserDataInLocalStorage } from "../utils/saveUserDataInLocalStorage";
import { getUserDataFromLocalStorage } from "../utils/getUserDataFromLocalStorage";
import { dataIsDiferent } from "../utils/dataIsDiferent";
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG } from "../utils/constants"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {executeSecuredApi} from "../utils/executeSecuredApi"

/**
 * Pagina creada para llevar perfil de usuario, tanto para
 * actualizacion como visualizacion
 */
export function Profile({ edit }) {
    // states
    let [profileData, setProfileData] = useState(getUserDataFromLocalStorage());
    let { loadingState, startLoading, setLoadingState, successfullyLoaded } =useContext(LoadingContext);
    const navigate = useNavigate();
    const onUpdate = async (data) => {
        startLoading();
        // el data.photo siempre sera: null, url de imagen actual, un archivo
        const sendingData = { ...data };
        if (dataIsDiferent(data, profileData)) { // lodash
            const response = await executeSecuredApi(async ()=>{
                return await updateUserDataAPI( sendingData, getJWTFromLocalStorage().access)
            }, navigate)
            if (response){
                if (response !== "unexpected_error" && response.status == 200){
                    profileData.photo_link = response.data.user_data_updated.photo_link
                    setProfileData(response.data.user_data_updated);
                    saveUserDataInLocalStorage(response.data.user_data_updated);
                    successfullyLoaded();
                } else {
                    if (response.message === BASE_FALLEN_SERVER_ERROR_MSG){
                        setLoadingState(BASE_FALLEN_SERVER_LOG)
                    } else {
                        if (response.response.data.error === "cloudinary_error"){
                            setLoadingState("Error con la nube!");
                        } else {
                            setLoadingState(response.response.data.error === "username_or_email_taken" ? "El usuario o el email ya están tomados !" : "Error inesperado al actualizar datos del usuario !");
                        }
                    }
                }
            }
        } else {
            setLoadingState("Sin cambios");
        }
    };


    if (!userIsAuthenticated()) {
        return <UserNotLogged />;
    } else {
        return (
            <div className="centered-container">
                <div className="profile-container">
                    <Header username={profileData.username} msg={edit ? "Editando perfil" : "Viendo perfil"} />
                    <Loader state={loadingState}/>
                    <div className="editing-container">
                        {edit ? 
                            <UserInfoForm onFormSubmit={onUpdate} userData={profileData} userPhotoUrl={profileData.photo_link} extraButtons={[<Button key={v4()} buttonText="Volver" onClickFunction={() => {navigate("/home/profile/")} }/>,]}/>
                            : 
                            <>
                                <UserData userData={profileData} nonShowableAttrs={["is_active","id","photo_link",]} attrsTraductions={{username: "Nombre de usuario",email: "Correo electrónico"}} />
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
