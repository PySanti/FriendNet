// components
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useRef } from "react";
// api's
import { activateUserAPI } from "../api/activateUser.api";
import { generateActivationCode } from "../utils/generateActivationCode";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { sendActivationEmailAPI } from "../api/sendActivationEmail.api";
import { UserLogged } from "./UserLogged";
import { UserNotLogged } from "./UserNotLogged";
import { Loader } from "../components/Loader";
import { ActivationCodeField } from "../components/ActivationCodeField";
import { Form } from "../components/Form";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_ACTIVATION_CODE_CONSTRAINTS} from "../utils/constants"
import {useLoadingState} from "../store/loadingStateStore"
/**
 * Pagina creada para llevar activacion de cuenta
 */
export function AccountActivation() {
    let { loadingState, setLoadingState, successfullyLoaded, startLoading } = useLoadingState((state)=>([state.loadingState, state.setLoadingState, state.successfullyLoaded, state.startLoading]));
    let realActivationCode                                                  = useRef(generateActivationCode());
    const props                                                             = useLocation().state;
    const navigate                                                          = useNavigate();
    const { register, handleSubmit, formState: { errors }}                  = useForm();
    const handleActivationCodeSending = async ()=>{
        setLoadingState(false);
        console.log(realActivationCode.current)
        try{
            const response = await sendActivationEmailAPI(props.userEmail, props.username, realActivationCode.current)
            successfullyLoaded()
        } catch(error){
            if (error.message == BASE_FALLEN_SERVER_ERROR_MSG){
                setLoadingState(BASE_FALLEN_SERVER_LOG)
            }
        }
    }
    const onSubmit = handleSubmit(async (data) => {
        startLoading();
        if (Number(data.activationCode) === Number(realActivationCode.current)) {
            try {
                await activateUserAPI(props.userId);
                successfullyLoaded();
                navigate("/login/");
            } catch (error) {
                setLoadingState(error.message === BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : "Error inesperado en el servidor al activar usuario!");
            }
        } else {
            setLoadingState("Codigo invalido!");
        }
    });
    useEffect(() => {
        handleActivationCodeSending()
    }, []);

    if (userIsAuthenticated()) {
        return <UserLogged />;
    } else if (!props) {
        return <UserNotLogged />;
    } else {
        return (
            <div className="centered-container">
                <div className="account-activation-container">
                    <Header msg={`Correo de activación enviado a ${props.userEmail}`}/>
                    <Loader/>
                    <Form onSubmitFunction={onSubmit} buttonMsg="Activar" buttonsList={[<Button key={v4()} buttonText="Volver" onClickFunction={() => {navigate("/")}} />,<Button key={v4()} buttonText="Cambiar correo" onClickFunction={() => {navigate("/signup/activate/change_email", { state: props })}}/>]}>
                        <ActivationCodeField errors={errors.activationCode && errors.activationCode.message} registerObject={register("activationCode", BASE_ACTIVATION_CODE_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
        );
    }
}
