// react modules
import { Header }                   from "../components/Header";
import { useContext, useEffect, useState } from "react";
// api's
import { createUsuarioAPI }         from "../api/createUsuario.api";
import { checkExistingUserAPI } from "../api/checkExistingUser.api";

// styles
import "../styles/signup-styles.css"
import {   useNavigate } from "react-router-dom";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { UserForm } from "../components/UserForm";
import { UnExpectedError } from "../components/UnExpectedError";
import { Loader } from "../components/Loader";
import { SubmitStateContext } from "../context/SubmitStateContext";
import { saveCloudinary } from "../tools/saveCloudinary";


// constants


/**
 * Pagina creada para llevar registro de usuario
 */
export function SignUp() {
    let {loadingState, unExpectedError, successfullyLoaded, handleUnExpectedError, startLoading, nullSubmitStates} = useContext(SubmitStateContext)
    let [userData, setUserData]                                 = useState(null);
    const navigate                                              = useNavigate()
    const onSignUp = async (data) =>{
        try{
            startLoading()
            const checkUserResponse = await checkExistingUserAPI(data['username'], data['email'])
            const userAlreadyExists = checkUserResponse.data.existing === "true"
            if (!userAlreadyExists){
                const photo = data['photo']
                delete data.confirmPwd // el confirmPwd no puede ser enviado al backend
                delete data.photo
                try {
                    data['photo_link']              = await saveCloudinary(photo) // el serializer el backend recibe photo_link, no la foto en si
                    // data['photo_link'] = "(test)"
                    try{
                        const createUserResponse        = await createUsuarioAPI(data)
                        setUserData({
                            'userId' : createUserResponse.data.new_user_id,
                            'username' : data.username,
                            'userEmail' : data.email,
                        })
                        successfullyLoaded()
                    } catch(error){
                        handleUnExpectedError("Error inesperado creando usuario!")
                    }
                } catch(error){
                    handleUnExpectedError("Error inesperado subiendo imagen de usuario a la nube!")
                }
            } else {
                handleUnExpectedError("Ya existe un usuario con ese Nombre de usuario o Correo electronico!")
            }
        } catch(error){
            handleUnExpectedError("Error inesperado chequeando existencia de usuario en la base de datos!")
        }
}
    useEffect(()=>{
        nullSubmitStates()
    }, [])
    useEffect(() => {
        if (userData){
            navigate('/signup/activate', {state: userData})
        }
    }, [userData])

    if (userIsAuthenticated()){
        return <UserLogged/>
    } else {
        return (
            <>
                <Header msg="Regístrate de una vez!"/>
                {unExpectedError && <UnExpectedError msg={unExpectedError}/>}
                {loadingState && <Loader state={loadingState}/>}
                <UserForm onSubmitFunction={onSignUp} updating={false} />
            </>
        )
    }
}
