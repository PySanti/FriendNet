// react modules
import { Header }                   from "../components/Header";
// api's
import { createUsuarioAPI }         from "../api/createUsuario.api";
import { checkExistingUserAPI } from "../api/checkExistingUser.api";

import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"

// styles
import {   useNavigate } from "react-router-dom";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { UserInfoForm } from "../components/UserInfoForm";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import {useLoadingState} from "../store"
import {generateLocationProps} from "../utils/generateLocationProps"
import {executeApi} from "../utils/executeApi"
/**
 * Page creada para el registro de los usuarios
 */
export function SignUp() {
    const [startLoading, setLoadingState] = useLoadingState((state)=>([state.startLoading, state.setLoadingState]))
    const navigate                                              = useNavigate()
    const onSignUp = async (data) =>{
        toast.loading('Creando usuario')
        let response = await executeApi(async ()=>{
            return await checkExistingUserAPI(data['username'], data['email'])
        }, navigate)
        if (response){
            if (response.status == 200){
                if (!response.data.existing){
                    delete data.confirmPwd
                    response = await executeApi(async ()=>{
                        return await createUsuarioAPI(data)
                    }, navigate, setLoadingState)
                    if (response){
                        if (response.status == 200){
                            setLoadingState(false)
                            navigate('/signup/activate', {state: generateLocationProps(data.email, data.username, response.data.new_user_id)})
                        } else if (response.data.error == "cloudinary_error"){
                            setLoadingState("¡ Error con la nube !")
                        } else {
                            setLoadingState("¡ Error inesperado creando un usuario para ti !")
                        }
                    }
                }else {
                    setLoadingState("¡ Ya existe un usuario con ese Nombre de usuario o Correo electrónico !")
                }
            } else {
                setLoadingState("¡ Error inesperado revisando si existe un usuario con esos datos !")
            }
        }
}
    useEffect(()=>{
        document.title = generateDocumentTitle("Registrando")
    }, [])

    if (userIsAuthenticated()){
        return <UserLogged/>
    } else {
        return (
            <div className="centered-container">
                <div className="signup-page-container">
                    <Header msg="¡ Regístrate !"/>
                    <UserInfoForm onFormSubmit={onSignUp} extraButtons={[<Button key={v4()} back onClickFunction={()=>{navigate('/')}}/>,]}/>
                </div>
            </div>
        )
    }
}
