import { useForm } from "react-hook-form";
import { PropTypes } from "prop-types";
import {
    BASE_EMAIL_CONSTRAINTS,
    BASE_PASSWORD_CONSTRAINTS,
    BASE_USERNAME_CONSTRAINTS,
} from "../utils/constants.js";
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
 * @param {Function} onFormSubmit funcion que se ejecutara cuando se envie el formulario
 * @param {Array} extraButtons arreglo de buttons extra que se quiera agregar al formulario
 */
export function UserInfoForm({ userData, onFormSubmit, extraButtons}) {
    let [currentPhotoFile, setCurrentPhotoFile] = useState(userData ? userData.photo_link : null);
    const { register, handleSubmit, formState: { errors }, watch} = useForm();
    const onSubmit = handleSubmit((data) => {
        data.photo = currentPhotoFile; // currentPhotoFile o es null o es una imagen que ya esta validada o es la misma imagen que el usuario ya tenia
        onFormSubmit(data);
    });
    const passwordChecking = (type) => {
        return (password) => {
            if (password != watch(type === "password" ? "confirmPwd" : "password")) {
                return "Las contraseñas no son iguales";
            } else {
                if (type === "password" && errors.confirmPwd) {
                    errors.confirmPwd.message= null;
                } else if (type === "confirmPwd" && errors.password){
                    errors.password.message= null;
                }
            }
        };
    };
    useEffect(() => {
        // de esta manera, se deberia actualizar el estado cada vez que cambie la url del usuario
        setCurrentPhotoFile(userData ? userData.photo_link : null);
    }, [userData]);
    return (
        <div className="user-form-container">
            <Form onSubmitFunction={onSubmit}buttonMsg={userData ? "Actualizar" : "Registrar"}buttonsList={extraButtons}>
                <>
                    <UsernameField      defaultValue={userData ? userData.username : undefined }              errors={errors.username && errors.username.message}         registerObject={register(    "username",    BASE_USERNAME_CONSTRAINTS)}/>
                    <EmailField         defaultValue={userData ? userData.email : undefined}       errors={errors.email && errors.email.message}               registerObject={register(    "email",    BASE_EMAIL_CONSTRAINTS)}/>
                    {!userData && (
                        <>
                            <PasswordField label="Contraseña"           errors={errors.password && errors.password.message } registerObject={register("password", {     ...BASE_PASSWORD_CONSTRAINTS, validate: passwordChecking("password"), })}/>
                            <PasswordField label="Confirmar Contraseña" errors={errors.confirmPwd && errors.confirmPwd.message } registerObject={register("confirmPwd", {     ...BASE_PASSWORD_CONSTRAINTS, validate: passwordChecking("confirmPwd"), })} />
                        </>
                    )}
                </>
            </Form>
            <UserPhoto withInput photoFile={currentPhotoFile} photoFileSetter={setCurrentPhotoFile} />
        </div>
    );
}

UserInfoForm.propTypes = {
    userData: PropTypes.object,
    onFormSubmit: PropTypes.func.isRequired,
    extraButtons: PropTypes.array,
};

UserInfoForm.defaultProps = {
    userData: undefined,
    extraButtons: undefined,
};
