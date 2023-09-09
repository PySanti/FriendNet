// components
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState, useRef } from "react";
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
import { LoadingContext } from "../context/LoadingContext";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG, BASE_ACTIVATION_CODE_CONSTRAINTS} from "../utils/constants"

/**
 * Pagina creada para llevar activacion de cuenta
 */
export function AccountActivation() {
    let { loadingState, setLoadingState, successfullyLoaded, startLoading } = useContext(LoadingContext);
    let realActivationCode                                                  = useRef(null);
    const props                                                             = useLocation().state;
    const navigate                                                          = useNavigate();
    const { register, handleSubmit, formState: { errors }}                  = useForm();
    const handleActivationCodeSending = async ()=>{
        setLoadingState(false);
        const activationCode = generateActivationCode();
        console.log(activationCode)
        realActivationCode.current =  activationCode
        await sendActivationEmailAPI(props.userEmail, props.username, activationCode)
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
                    <Header username={props.username} msg={`Correo de activación enviado a ${props.userEmail}`}/>
                    <Loader state={loadingState} />
                    <Form onSubmitFunction={onSubmit} buttonMsg="Activar" buttonsList={[<Button key={v4()} buttonText="Volver" onClickFunction={() => {navigate("/")}} />,<Button key={v4()} buttonText="Cambiar correo" onClickFunction={() => {navigate("/signup/activate/change_email", { state: props })}}/>]}>
                        <ActivationCodeField errors={errors.activationCode && errors.activationCode.message} registerObject={register("activationCode", BASE_ACTIVATION_CODE_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
        );
    }
}
