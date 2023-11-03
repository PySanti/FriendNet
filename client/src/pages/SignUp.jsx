// react modules
import { Header }                   from "../components/Header";
// api's
import { createUsuarioAPI }         from "../api/createUsuario.api";
import { checkExistingUserAPI } from "../api/checkExistingUser.api";

// styles
import {   useNavigate } from "react-router-dom";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { UserInfoForm } from "../components/UserInfoForm";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import {useLoadingState} from "../store/loadingStateStore"
import {BASE_UNEXPECTED_ERROR_LOG} from "../utils/constants"
import {generateLocationProps} from "../utils/generateLocationProps"
/**
 * Page creada para el registro de los usuarios
 */
export function SignUp() {
    const [successfullyLoaded, startLoading, setLoadingState] = useLoadingState((state)=>([state.successfullyLoaded, state.startLoading, state.setLoadingState]))
    const navigate                                              = useNavigate()
    const onSignUp = async (data) =>{
        try{
            startLoading()
            const checkUserResponse = await checkExistingUserAPI(data['username'], data['email'])
            if (!checkUserResponse.data.existing){
                delete data.confirmPwd
                try{
                    const createUserResponse        = await createUsuarioAPI(data)
                    successfullyLoaded()
                    navigate('/signup/activate', {state: generateLocationProps(data.email, data.username, createUserResponse.data.new_user_id)})
                } catch(error){
                    if (error.response.data.error === "cloudinary_error"){
                        setLoadingState("Error con la nube!")
                    } else {
                        setLoadingState(BASE_UNEXPECTED_ERROR_LOG)
                    }
                }
            } else {
                setLoadingState("Ya existe un usuario con ese Nombre de usuario o Correo electrónico!")
            }
        } catch(error){
            setLoadingState(BASE_UNEXPECTED_ERROR_LOG)
        }
}

    if (userIsAuthenticated()){
        return <UserLogged/>
    } else {
        return (
            <div className="centered-container">
                <div className="signup-page-container">
                    <Header msg="Regístrate de una vez!"/>
                    <UserInfoForm onFormSubmit={onSignUp} extraButtons={[<Button key={v4()} buttonText="Volver" onClickFunction={()=>{navigate('/')}}/>,]}/>
                </div>
            </div>
        )
    }
}
