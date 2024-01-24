// components
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
// api's
import { activateUserAPI } from "../api/activateUser.api";
import { generateActivationCode } from "../utils/generateActivationCode";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { sendActivationEmailAPI } from "../api/sendActivationEmail.api";
import { UserLogged } from "./UserLogged";
import { UserNotLogged } from "./UserNotLogged";
import { ActivationCodeField } from "../components/ActivationCodeField";
import { Form } from "../components/Form";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import {BASE_ACTIVATION_CODE_CONSTRAINTS} from "../utils/constants"
import {useLoadingState} from "../store"
import {executeApi} from "../utils/executeApi"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"
/**
 * Pagina creada para llevar activacion de cuenta
 */
export function AccountActivation() {
    let [setLoadingState, startLoading]                                     = useLoadingState((state)=>([state.setLoadingState, state.startLoading]));
    let realActivationCode                                                  = useRef(generateActivationCode());
    const props                                                             = useLocation().state;
    const navigate                                                          = useNavigate();
    const { register, handleSubmit, formState : {errors}}                  = useForm();
    const handleActivationCodeSending = async ()=>{
        console.log('-> ', realActivationCode.current)
        const response = await executeApi(async ()=>{
            return await sendActivationEmailAPI(props.userEmail, props.username, realActivationCode.current) 
        }, navigate)
        if (response){
            if (response.status != 200){
                setLoadingState('¡ Error inesperado enviando código de activación !')
            }
        }
    }
    const onSubmit = handleSubmit(async (data) => {
        if (Number(data.activationCode) === Number(realActivationCode.current)) {
            const response = await executeApi(async ()=>{
                return await activateUserAPI(props.userId); 
            }, navigate)
            if (response){
                if (response.status == 200){
                    setLoadingState(false)
                    navigate("/login/");
                } else {
                    setLoadingState("¡ Error inesperado activando tu cuenta !")
                }
            }
        } else {
            setLoadingState("¡ Código invalido !");
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
                        <ActivationCodeField errors={errors.activationCode && errors.activationCode.message} registerObject={register("activationCode", BASE_ACTIVATION_CODE_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
        );
    }
}
