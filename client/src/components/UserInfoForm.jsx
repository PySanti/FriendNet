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
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
/**
 * Componente creado para los formularios de SignUp y Update,
 * teniendo en cuenta las similitudes entre ambos
 * @param {Bool} updating sera true cuando se este actualizando
 * @param {Function} onFormSubmit funcion que se ejecutara cuando se envie el formulario
 * @param {Array} extraButtons arreglo de buttons extra que se quiera agregar al formulario
 */
export function UserInfoForm({ updating, onFormSubmit, extraButtons}) {
    const userData = getUserDataFromLocalStorage()
    let [currentPhotoFile, setCurrentPhotoFile] = useState(updating ? userData.photo_link : null);
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
        console.log("El usuario ha cambiado su imagen en el server");
        // de esta manera, se deberia actualizar el estado cada vez que cambie la url del usuario
        setCurrentPhotoFile(updating ? userData.photo_link : null);
    }, [userData]);
    return (
        <div className="user-form-container">
            <Form onSubmitFunction={onSubmit}buttonMsg={updating ? "Actualizar" : "Registrar"}buttonsList={extraButtons}>
                <>
                    <UsernameField      defaultValue={updating ? userData.username : "juanca"}              errors={errors.username && errors.username.message}         registerObject={register(    "username",    BASE_USERNAME_CONSTRAINTS)}/>
                    <EmailField         defaultValue={updating ? userData.email : "juanca@gmail.com"}       errors={errors.email && errors.email.message}               registerObject={register(    "email",    BASE_EMAIL_CONSTRAINTS)}/>
                    {!updating && (
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
    updating: PropTypes.bool,
    onFormSubmit: PropTypes.func.isRequired,
    extraButtons: PropTypes.array,
};

UserInfoForm.defaultProps = {
    updating: undefined,
    extraButtons: undefined,
};
