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
import { Loader } from "../components/Loader";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import { BASE_RATE_LIMIT_BLOCK_RESPONSE} from "../utils/constants"
import {handleStandardApiErrors} from "../utils/handleStandardApiErrors"
import {useLoadingState} from "../store/loadingStateStore"
import {useEffect} from "react"
import {BASE_UNEXPECTED_ERROR_LOG} from "../utils/constants"
export function SignUp() {
    const [successfullyLoaded, startLoading, setLoadingState] = useLoadingState((state)=>([state.successfullyLoaded, state.startLoading, state.setLoadingState]))
    const navigate                                              = useNavigate()
    const onSignUp = async (data) =>{
        try{
            startLoading()
            const checkUserResponse = await checkExistingUserAPI(data['username'], data['email'])
            if (checkUserResponse.data.existing !== "true"){
                delete data.confirmPwd
                try{
                    const createUserResponse        = await createUsuarioAPI(data)
                    successfullyLoaded()
                    navigate('/signup/activate', {state: { 'userId' : createUserResponse.data.new_user_id, 'username' : data.username, 'userEmail' : data.email, 'password' : data.password}})
                } catch(error){
                    try{
                        if (error.response.data.error === "cloudinary_error"){
                            setLoadingState("Error con la nube!")
                        } else {
                            handleStandardApiErrors(error.response, setLoadingState, "Error creando usuario !")
                        }
                    } catch(error){
                        setLoadingState(BASE_UNEXPECTED_ERROR_LOG)
                    }
                }
            } else {
                setLoadingState("Ya existe un usuario con ese Nombre de usuario o Correo electronico!")
            }
        } catch(error){
            try{
                handleStandardApiErrors(error.response, setLoadingState, "Hubo un error comprobando existencia de usuario !")
            } catch(error){
                setLoadingState(BASE_UNEXPECTED_ERROR_LOG)
            }
        }
}
    useEffect(()=>{
        setLoadingState(false)
    }, [])


    if (userIsAuthenticated()){
        return <UserLogged/>
    } else {
        return (
            <div className="centered-container">
                <div className="signup-page-container">
                    <Header msg="Regístrate de una vez!"/>
                    <Loader/>
                    <UserInfoForm onFormSubmit={onSignUp} extraButtons={[<Button key={v4()} buttonText="Volver" onClickFunction={()=>{navigate('/')}}/>,]}/>
                </div>
            </div>
        )
    }
}
