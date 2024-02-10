// components
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useForm } from "react-hook-form";
import {toast} from "sonner"
import { useEffect } from "react";
// api's
import { activateUserAPI } from "../api/activateUser.api";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { generateSendSecurityCodeAPI } from "../api/generateSendSecurityCode.api";
import { UserLogged } from "./UserLogged";
import { UserNotLogged } from "./UserNotLogged";
import { CodeField } from "../components/CodeField";
import { Form } from "../components/Form";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import {BASE_SECURITY_CODE_CONSTRAINTS} from "../utils/constants"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"
import {toastedApiCall} from "../utils/toastedApiCall"
import {nonToastedApiCall} from "../utils/nonToastedApiCall"
import {checkSecurityCodeAPI} from "../api/checkSecurityCode.api"
/**
 * Pagina creada para llevar activacion de cuenta
 */
export function AccountActivation() {
    const props                                                             = useLocation().state;
    const navigate                                                          = useNavigate();
    const { register, handleSubmit, formState : {errors}}                  = useForm();
    const handleActivationCodeSending = async ()=>{
        const response = await nonToastedApiCall(async ()=>{
            return await generateSendSecurityCodeAPI(props.userEmail, `Activa tu cuenta`) 
        }, navigate, 'Enviando correo de activación, espere', 5000)
        if (response){
            if (response.status == 200){
                toast.success(`Correo de activación enviado `)
            }  else {
                toast.error("¡ Error inesperado enviando correo de activación !")
            }
        }
    }
    const onSubmit = handleSubmit(async (data) => {
        let response = await toastedApiCall(async ()=>{
            return await checkSecurityCodeAPI(props.userEmail, data.activationCode); 
        }, navigate, 'Revisando código')
        if (response){
            if (response.status == 200){
                toast.success("Código valido")
                response = await toastedApiCall(async ()=>{
                    return await activateUserAPI(props.userId); 
                }, navigate, 'Activando cuenta')
                if (response){
                    if (response.status == 200){
                        toast.success("Usuario activado con éxito, bienvenid@")
                        navigate("/login/");
                    } else {
                        toast.error("¡ Error inesperado activando su cuenta !")
                    }
                }
            } else {
                if (response.data.error == "invalid_security_code"){
                    toast.error("¡ Código invalido !")
                } else {
                    toast.error("¡ Hubo un error inesperado revisando el código !")
                }
            }
        }
    });
    useEffect(() => {
        document.title = generateDocumentTitle("Activando Cuenta")
        if (props){
            (async function(){
                await handleActivationCodeSending()
            } )()
        }
    }, []);

    if (userIsAuthenticated()) {
        return <UserLogged />;
    } else if (!props) {
        return <UserNotLogged msg="No puedes activar tu cuenta si aun no te has registrado o tratado de logear"/>;
    } else {
        return (
            <div className="centered-container">
                <div className="account-activation-container">
                    <Header msg={`Correo de activación enviado a ${props.userEmail}`}/>
                    <Form 
                        onSubmitFunction={onSubmit} 
                        buttonMsg="Activar" 
                        buttonsList={[<Button key={v4()} back onClickFunction={() => {navigate("/")}} />,<Button key={v4()} buttonText="Cambiar correo" onClickFunction={() => {navigate("/signup/activate/change_email", { state: props })}}/>]}
                        >
                        <CodeField errors={errors.activationCode && errors.activationCode.message} registerObject={register("activationCode", BASE_SECURITY_CODE_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
        );
    }
}
