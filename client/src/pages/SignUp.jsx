// react modules
import { Header }                   from "../components/Header";
import { useContext, useEffect, useState } from "react";
// api's
import { createUsuarioAPI }         from "../api/createUsuario.api";
import { checkExistingUserAPI } from "../api/checkExistingUser.api";

// styles
import {   useNavigate } from "react-router-dom";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { UserForm } from "../components/UserForm";
import { Loader } from "../components/Loader";
import { LoadingContext } from "../context/LoadingContext";
import { saveCloudinary } from "../tools/saveCloudinary";

import "../styles/SignUp.css"


// constants


/**
 * Pagina creada para llevar registro de usuario
 */
export function SignUp() {
    let {loadingState, successfullyLoaded, startLoading, setLoadingState} = useContext(LoadingContext)
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
                        setLoadingState("Error inesperado creando usuario!")
                    }
                } catch(error){
                    setLoadingState("Error inesperado subiendo imagen de usuario a la nube!")
                }
            } else {
                setLoadingState("Ya existe un usuario con ese Nombre de usuario o Correo electronico!")
            }
        } catch(error){
            setLoadingState("Error inesperado chequeando existencia de usuario en la base de datos!")
        }
}
    useEffect(()=>{
        setLoadingState(false)
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
            <div className="centered-container">
                <div className="signup-page-container">
                    <Header msg="Regístrate de una vez!"/>
                    <Loader state={loadingState}/>
                    <UserForm onSubmitFunction={onSignUp} updating={false} />
                </div>
            </div>
        )
    }
}
