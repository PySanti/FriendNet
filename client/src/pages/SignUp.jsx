// react modules
import { Header }                   from "../components/Header";
import { useEffect, useState } from "react";
// api's
import { createUsuarioAPI }         from "../api/createUsuario.api";
import { postCloudinaryImgAPI }     from "../api/postCloudinaryImg.api";
import { checkExistingUserAPI } from "../api/checkExistingUser.api";

// styles
import "../styles/signup-styles.css"
import {  useNavigate } from "react-router-dom";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { UserDataForm } from "../components/UserDataForm";


// constants


export function SignUp() {
    let [userData, setUserData]                                 = useState(null);
    let [unExpectedError, setUnExpectedError]                   = useState(null)
    let [userExists, setUserExists]                             = useState(false)
    const navigate                                              = useNavigate()
    const onSignUp = async (data) =>{
        try{
            const checkUserResponse = await checkExistingUserAPI(data['username'], data['email'])
            const userAlreadyExists = checkUserResponse.data.existing === "true"
            if (!userAlreadyExists){
                const photo = data['photo']
                delete data.confirmPwd // el confirmPwd no puede ser enviado al backend
                delete data.photo
                try {
                    // const uploadedImgData           = await postCloudinaryImgAPI(photo)
                    data['photo_link']              = "(test)" // el serializer el backend recibe photo_link, no la foto en si
                    try{
                        const createUserResponse        = await createUsuarioAPI(data)
                        setUserData({
                            'userId' : createUserResponse.data.new_user_id,
                            'username' : data.username,
                            'userEmail' : data.email,
                        })
                    } catch(error){
                        const errorMsg = error.response.data.error
                        if (errorMsg === "error_creating"){
                            setUnExpectedError("Error inesperado creando usuario!")
                        } else{
                            setUnExpectedError("Error inesperado lanzado por serializador de api!")
                        }
                    }
                } catch(error){
                    setUnExpectedError("Error inesperado subiendo imagen de usuario a la nube!")
                }
            } else {
                setUserExists(true)
                const [backToRoot, setBackToRoot] = useState(false)
                const navigate = useNavigate()
                useEffect(()=>{
                    if(backToRoot){
                        navigate('/')
                    }
                }, [backToRoot])    }
        } catch(error){
            setUnExpectedError("Error inesperado chequeando existencia de usuario en la base de datos!")
        }
    }
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
                <Header/>
                {unExpectedError && unExpectedError}
                {userExists && "Ya existe un usuario con ese Nombre de usuario o Correo electrónico"}
                <UserDataForm 
                    onSubmitFunction={onSignUp} 
                    method="POST" 
                    updating={false} 
                />
            </>
        )
    }
}
