import { useForm } from "react-hook-form";
import { PropTypes } from "prop-types";
import { FormField } from "./FormField";
import {
    BASE_EMAIL_CONSTRAINTS,
    BASE_FIRSTNAMES_MAX_LENGTH,
    BASE_LASTNAMES_MAX_LENGTH,
    BASE_PASSWORD_CONSTRAINTS,
    BASE_USERNAME_CONSTRAINTS,
} from "../main";
import { Form } from "./Form";
import "../styles/UserInfoForm.css";
import { UserPhoto } from "./UserPhoto";
import { useEffect, useState } from "react";
import { UsernameField } from "./UsernameField";
import { PasswordField } from "./PasswordField";
import { EmailField } from "./EmailField";

/**
 * Componente creado para los formularios de SignUp y Update,
 * teniendo en cuenta las similitudes entre ambos
 * @param {Object} userData datos del usuario, se enviaran en caso de que se este actualizando
 * @param {Boolean} updating representara si se esta actualizando
 * @param {String} userPhotoUrl imagen del usuario, se enviara si se esta actualizando
 * @param {Function} onFormSubmit funcion que se ejecutara cuando se envie el formulario
 * @param {Array} extraButtons arreglo de buttons extra que se quiera agregar al formulario
 */
export function UserInfoForm({
    userData,
    updating,
    userPhotoUrl,
    onFormSubmit,
    extraButtons,
}) {
    let [currentPhotoFile, setCurrentPhotoFile] = useState(userPhotoUrl);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const onSubmit = handleSubmit((data) => {
        data.age = Number(data.age); // las edades se manejan como text fields para que su checkeo sea mas facil
        data.photo = currentPhotoFile; // currentPhotoFile o es null o es una imagen que ya esta validada o es la misma imagen que el usuario ya tenia
        onFormSubmit(data);
    });
    const passwordChecking = (type) => {
        return (password) => {
            if (
                password !=
                watch(type === "password" ? "confirmPwd" : "password")
            ) {
                return "Las contraseñas no son iguales";
            } else {
                if (type === "password") {
                    errors.confirmPwd = null;
                } else {
                    errors.password = null;
                }
            }
        };
    };
    useEffect(() => {
        console.log("El usuario ha cambiado su imagen en el server");
        // de esta manera, se deberia actualizar el estado cada vez que cambie la url del usuario
        setCurrentPhotoFile(userPhotoUrl ? userPhotoUrl : null);
    }, [userPhotoUrl]);
    return (
        <div className="user-form-container">
            <Form
                onSubmitFunction={onSubmit}
                buttonMsg={updating ? "Actualizar" : "Registrar"}
                buttonsList={extraButtons}
            >
                <>
                    <UsernameField
                        defaultValue={userData ? userData.username : "juanca"}
                        errors={errors.username && errors.username.message}
                        registerObject={register(
                            "username",
                            BASE_USERNAME_CONSTRAINTS
                        )}
                    />
                    <EmailField
                        defaultValue={
                            userData ? userData.email : "juanca@gmail.com"
                        }
                        errors={errors.email && errors.email.message}
                        registerObject={register(
                            "email",
                            BASE_EMAIL_CONSTRAINTS
                        )}
                        label="Correo Electrónico"
                    />
                    <FormField
                        label="Nombres"
                        errors={
                            errors.first_names && errors.first_names.message
                        }
                    >
                        <input
                            defaultValue={
                                userData ? userData.first_names : "Juan Carlos"
                            }
                            maxLength={BASE_FIRSTNAMES_MAX_LENGTH}
                            type="text"
                            id="first_names"
                            name="first_names"
                            {...register("first_names", {
                                required: {
                                    value: true,
                                    message:
                                        "Por favor, ingresa tu(s) primer(os) nombre(s)",
                                },
                                pattern: {
                                    value: /^[^\d]+$/,
                                    message:
                                        "Por favor, ingresa un(os) nombre(s) valido(s)",
                                },
                            })}
                        />
                    </FormField>
                    <FormField
                        label="Apellidos"
                        errors={errors.last_names && errors.last_names.message}
                    >
                        <input
                            defaultValue={
                                userData
                                    ? userData.last_names
                                    : "Garcia Marquez"
                            }
                            maxLength={BASE_LASTNAMES_MAX_LENGTH}
                            type="text"
                            id="last_names"
                            name="last_names"
                            {...register("last_names", {
                                required: {
                                    value: true,
                                    message:
                                        "Por favor, ingresa tu(s) apellido(s)",
                                },
                                pattern: {
                                    value: /^[^\d]+$/,
                                    message:
                                        "Por favor, ingresa un(os) apellido(s) valido(s)",
                                },
                            })}
                        />
                    </FormField>
                    <FormField
                        label="Edad"
                        errors={errors.age && errors.age.message}
                    >
                        <input
                            defaultValue={userData ? userData.age : 18}
                            type="number"
                            id="age"
                            name="age"
                            {...register("age", {
                                required: {
                                    value: true,
                                    message: "Por favor, ingresa tu edad.",
                                },
                                max: {
                                    value: 120,
                                    message:
                                        "Por favor, ingresa una edad valida",
                                },
                                min: {
                                    value: 5,
                                    message: "Debes tener al menos 5 años",
                                },
                                pattern: {
                                    value: /^-?\d+$/,
                                    message:
                                        "Por favor, ingresa una edad valida",
                                },
                            })}
                        />
                    </FormField>
                    {!updating && (
                        <>
                            <PasswordField
                                label="Contraseña"
                                name="password"
                                errors={
                                    errors.password && errors.password.message
                                }
                                registerObject={register("password", {
                                    ...BASE_PASSWORD_CONSTRAINTS,
                                    validate: passwordChecking("password"),
                                })}
                            />
                            <PasswordField
                                label="Confirmar Contraseña"
                                name="confirmPwd"
                                errors={
                                    errors.confirmPwd &&
                                    errors.confirmPwd.message
                                }
                                registerObject={register("confirmPwd", {
                                    ...BASE_PASSWORD_CONSTRAINTS,
                                    validate: passwordChecking("confirmPwd"),
                                })}
                            />
                        </>
                    )}
                </>
            </Form>
            <UserPhoto
                withInput
                photoFile={currentPhotoFile}
                photoFileSetter={setCurrentPhotoFile}
            />
        </div>
    );
}

UserInfoForm.propTypes = {
    userData: PropTypes.object,
    updating: PropTypes.bool,
    userPhotoUrl: PropTypes.string,
    onFormSubmit: PropTypes.func.isRequired,
    extraButtons: PropTypes.array,
};
UserInfoForm.defaultProps = {
    userData: undefined,
    updating: undefined,
    userPhotoUrl: undefined,
    extraButtons: undefined,
};
