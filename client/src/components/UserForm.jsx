import { useForm } from "react-hook-form"
import { FormField } from "./FormField"

/**
 * Componente creado para SignUp.jsx, EditProfile.jsx y Login.jsx
 * Retorna un formulario con soporte para errores que funcionara
 * tanto para actualizar como para registrar, como para logear un usuario
 * @param {Object} userData - Los datos del usuario, para Edit.jsx
 * @param {Function} onSubmitFunction - Funcion que se ejecutara despues de enviar el formulario
 * @param {Boolean} login - Representa si se desea retornar el formulario para login
 * @param {Boolean} updating - Representa se se desea retornar el formulario para update
 * @param {Function} onPhotoChange - Se ejecutara cuando se ingrese una foto en el photoInput
 */
export function UserForm({userData, onSubmitFunction, login, updating, onPhotoChange}){
    const {register, handleSubmit, formState: {errors}, watch}  = useForm()
    const onSubmit = handleSubmit((data)=>{
        onSubmitFunction(data)
    })
    const BASE_USERNAME_MAX_LENGTH = 15
    const BASE_USERNAME_MIN_LENGTH = 6
    const BASE_FIRSTNAMES_MAX_LENGTH = 30
    const BASE_LASTNAMES_MAX_LENGTH = 30
    const BASE_PASSWORD_MIN_LENGTH = 10
    const BASE_USERNAME_CONSTRAINTS = {
        required: {
            value : true,
            message : "Por favor, ingresa el nombre de tu usuario"
        },
        minLength : {
            value : BASE_USERNAME_MIN_LENGTH,
            message : `Por favor, ingresa un usuario con al menos ${BASE_USERNAME_MIN_LENGTH} caracteres`
        },
    }
    const BASE_PASSWORD_CONSTRAINTS = {
        required:{
            value: true,
            message : "Por favor, ingresa una contraseña"
        },
        minLength : {
            value : BASE_PASSWORD_MIN_LENGTH    ,
            message : `Por favor, ingresa una contraseña con al menos ${BASE_PASSWORD_MIN_LENGTH} caracteres`
        }
    }


    if (login){
        return (
                <form onSubmit={onSubmit}>
                    <FormField  label="Nombre de usuario" errors={errors.username && errors.username.message}>
                        <input type="text"name="username"id="username"maxLength={BASE_USERNAME_MAX_LENGTH}{...register("username", BASE_USERNAME_CONSTRAINTS)}/>
                    </FormField>
                    <FormField  label="Contraseña" errors={errors.password && errors.password.message}>
                        <input type="password"name="password"id="password"{...register("password", BASE_PASSWORD_CONSTRAINTS)}/>
                    </FormField>
                    <button type="submit">acceder</button>
                </form>
        )
    } else {
        return (
                <form onSubmit={onSubmit}> 
                    <FormField label="Nombre de usuario" errors={errors.username &&  errors.username.message}>
                        <input defaultValue={userData && userData.username}maxLength={BASE_USERNAME_MAX_LENGTH}type="text" id="username" name="username"{...register("username", BASE_USERNAME_CONSTRAINTS)}/>
                    </FormField>
                    <FormField label="Correo electronico" errors={errors.email &&  errors.email.message}>
                        <input defaultValue={userData && userData.email}type="email" id="email" name="email"{...register("email", {    required:{        value: true,        message : "Por favor, ingresa tu correo electrónico"    },    pattern:{        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,        message : "Por favor, ingresa un correo electrónico valido"    }})}/>
                    </FormField>
                    <FormField label="Nombres" errors={errors.first_names  && errors.first_names.message}>
                        <input defaultValue={userData && userData.first_names}maxLength={BASE_FIRSTNAMES_MAX_LENGTH}type="text" id="first_names" name="first_names"{...register("first_names", {    required:{        value: true,        message : "Por favor, ingresa tu(s) primer(os) nombre(s)"    },    pattern : {        value :/^[^\d]+$/,        message : "Por favor, ingresa un(os) nombre(s) valido(s)"    }})}/>
                    </FormField>
                    <FormField label="Apellidos" errors={errors.last_names  && errors.last_names.message}>
                        <input defaultValue={userData && userData.last_names}maxLength={BASE_LASTNAMES_MAX_LENGTH}type="text" id="last_names" name="last_names"{...register("last_names", {    required:{        value: true,        message : "Por favor, ingresa tu(s) apellido(s)"     },    pattern : {        value :/^[^\d]+$/,        message : "Por favor, ingresa un(os) apellido(s) valido(s)"    }})}/>
                    </FormField>
                    <FormField label="Edad" errors={errors.age  && errors.age.message}>
                        <input defaultValue={userData && userData.age}type="number" id="age" name="age"{...register("age", {    required:{        value : true,        message : "Por favor, ingresa tu edad."    },    max : {        value : 120,        message : "Por favor, ingresa una edad valida"    },    min : {        value : 5,        message : "Debes tener al menos 5 años"    },    pattern : {        value : /^-?\d+$/,        message : "Por favor, ingresa una edad valida"    }})}/>
                    </FormField>
                    <FormField label="Foto de perfil" errors={errors.photo  && errors.photo.message}>
                        <input type="file"id="photo" name="photo"{...register("photo", {    required:{        value : !updating && true,        message : "Por favor, selecciona tu foto"    }}) } onChange={onPhotoChange && onPhotoChange} />
                    </FormField>
                    {!updating && 
                        <>
                            <FormField label="Contraseña" errors={errors.password && errors.password.message}>
                                <input defaultValue="16102005 python"type="password" id="password" name="password"{...register("password", BASE_PASSWORD_CONSTRAINTS)}/>
                            </FormField>
                            <FormField label="Confirma la contraseña" errors={errors.confirmPwd  && errors.confirmPwd.message}>
                                <input defaultValue="16102005 python"type="password" id="confirmPwd" name="confirmPwd"{...register("confirmPwd", {    validate : (confirmPwd) =>{        if (confirmPwd != watch("password")){            return "Las contrasenias no son iguales"        }    }})}/>
                            </FormField>
                            <button type="submit">registrar</button>
                        </>
                    }
                    {updating && 
                        <button type="submit">actualizar</button>
                    }
                </form>
        )
    }
}