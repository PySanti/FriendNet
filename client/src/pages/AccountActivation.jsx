// components
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
// api's
import { activateUserAPI } from "../api/activateUser.api";
import { generateActivationCode } from "../utils/generateActivationCode";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { sendMail } from "../utils/sendMail";
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
    let { loadingState, setLoadingState, successfullyLoaded, startLoading } =useContext(LoadingContext);
    let [userActivated, setUserActivated] = useState(false);
    let [realActivationCode, setRealActivationCode] = useState(null);
    let [goBack, setGoBack] = useState(false);
    let [goChangeEmail, setGoChangeEmail] = useState(false);
    const props = useLocation().state;
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }} = useForm();
    const onSubmit = handleSubmit(async (data) => {
        startLoading();
        if (Number(data.activationCode) === Number(realActivationCode)) {
            try {
                await activateUserAPI(props.userId);
                setUserActivated(true);
                successfullyLoaded();
            } catch (error) {
                setLoadingState(error.message === BASE_FALLEN_SERVER_ERROR_MSG ? BASE_FALLEN_SERVER_LOG : "Error inesperado en el servidor al activar usuario!");
            }
        } else {
            setLoadingState("Codigo invalido!");
        }
    });
    useEffect(() => {
        setLoadingState(false);
        // se enviara el correo de activacion la primera vez que se monte el componente
        const activationCode = generateActivationCode();
        sendMail(activationCode, props.userEmail, props.username);
        setRealActivationCode(activationCode);
    }, []);
    useEffect(() => {
        if (goBack) {
            navigate("/");
        }
    }, [goBack]);
    useEffect(() => {
        if (userActivated) {
            navigate("/login/");
        }
    }, [userActivated]);
    useEffect(() => {
        if (goChangeEmail) {
            navigate("/signup/activate/change_email", { state: props });
        }
    }, [goChangeEmail]);
    if (userIsAuthenticated()) {
        // comprobaciones para cuando se ejecute la url directamente
        return <UserLogged />;
    } else if (!props) {
        return <UserNotLogged />;
    } else {
        return (
            <div className="centered-container">
                <div className="account-activation-container">
                    <Header username={props.username} msg={`Correo de activación enviado a ${props.userEmail}`}/>
                    <Loader state={loadingState} />
                    <Form onSubmitFunction={onSubmit} buttonMsg="Activar" buttonsList={[<Button key={v4()} buttonText="Volver" onClickFunction={() => setGoBack(true)} />,<Button key={v4()} buttonText="Cambiar correo" onClickFunction={() => setGoChangeEmail(true)}/>]}>
                        <ActivationCodeField errors={errors.activationCode && errors.activationCode.message} registerObject={register("activationCode", BASE_ACTIVATION_CODE_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
        );
    }
}
