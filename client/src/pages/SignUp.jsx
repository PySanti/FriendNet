// react modules
import { Header }                   from "../components/Header";
import { useContext, useEffect, useState } from "react";
// api's
import { createUsuarioAPI }         from "../api/createUsuario.api";
import { checkExistingUserAPI } from "../api/checkExistingUser.api";

// styles
import {   useNavigate } from "react-router-dom";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { UserInfoForm } from "../components/UserInfoForm";
import { Loader } from "../components/Loader";
import { LoadingContext } from "../context/LoadingContext";
import { Button } from "../components/Button";
import { v4 } from "uuid";



// constants


/**
 * Pagina creada para llevar registro de usuario
 */
export function SignUp() {
    let {loadingState, successfullyLoaded, startLoading, setLoadingState} = useContext(LoadingContext)
    let [userData, setUserData]                                 = useState(null);
    let [goBack, setGoBack]                                     =   useState(false)
    const navigate                                              = useNavigate()
    const onSignUp = async (data) =>{
        try{
            startLoading()
            const checkUserResponse = await checkExistingUserAPI(data['username'], data['email'])
            if (checkUserResponse.data.existing !== "true"){
                try {
                    delete data.confirmPwd
                    try{
                        const createUserResponse        = await createUsuarioAPI(data)
                        setUserData({
                            'userId' : createUserResponse.data.new_user_id,
                            'username' : data.username,
                            'userEmail' : data.email,
                        })
                        successfullyLoaded()
                    } catch(error){
                        if (error.response.data.error === "cloudinary_error"){
                            setLoadingState("Error con la nube!")
                        } else {
                            setLoadingState("Error inesperado al actualizar datos del usuario!")
                        }
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
    useEffect(()=>{
        if (goBack){
            navigate('/')
        }
    }, [goBack])
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
                    <UserInfoForm onFormSubmit={onSignUp} extraButtons={[
                        <Button key={v4()} buttonText="Volver" onClickFunction={()=>setGoBack(true)}/>,
                    ]}/>
                </div>
            </div>
        )
    }
}
