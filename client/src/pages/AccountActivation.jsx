// components
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
// api's
import { activateUserAPI } from "../api/activateUser.api";
import { FormField } from "../components/FormField";
import { generateActivationCode } from "../utils/generateActivationCode";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { UserNotLogged } from "./UserNotLogged";
import { Loader } from "../components/Loader";
import { Form } from "../components/Form";
import { LoadingContext } from "../context/LoadingContext";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import {sendActivationEmailAPI} from "../api/sendActivationEmail.api"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG} from "../utils/constants"

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

    const sendMail = async (activation_code) => {
        // await sendActivationEmailAPI(props.userEmail, props.username, activation_code)
        console.log(activation_code);
    };

    const onSubmit = handleSubmit(async (data) => {
        startLoading();
        if (Number(data.activation_code) === Number(realActivationCode)) {
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
        const activation_code = generateActivationCode();
        sendMail(activation_code);
        setRealActivationCode(activation_code);
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
                    <Header
                        msg={`Correo de activación enviado a ${props.userEmail}`}
                    />
                    <Loader state={loadingState} />
                    <Form
                        onSubmitFunction={onSubmit}
                        buttonMsg="Activar"
                        buttonsList={[
                            <Button
                                key={v4()}
                                buttonText="Volver"
                                onClickFunction={() => setGoBack(true)}
                            />,
                            <Button
                                key={v4()}
                                buttonText="Cambiar correo"
                                onClickFunction={() => setGoChangeEmail(true)}
                            />,
                        ]}
                    >
                        <FormField
                            label="Codigo "
                            errors={
                                errors.activation_code &&
                                errors.activation_code.message
                            }
                        >
                            <input
                                type="text"
                                maxLength={6}
                                minLength={1}
                                name="activation_code"
                                id="activation_code"
                                {...register("activation_code", {
                                    required: {
                                        value: true,
                                        message:
                                            "Por favor ingresa un código de activación",
                                    },
                                    pattern: {
                                        value: /^-?\d+$/,
                                        message:
                                            "Por favor, ingresa un codigo valido",
                                    },
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Debes ingresar al menos 6 caracteres",
                                    },
                                })}
                            />
                        </FormField>
                    </Form>
                </div>
            </div>
        );
    }
}
