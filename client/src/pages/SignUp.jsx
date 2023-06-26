// react modules
import { Header }                   from "../components/Header";
import { useForm }                    from "react-hook-form"
import { useState } from "react";
// api's
import { createUsuarioAPI }         from "../api/createUsuario.api";
import { postCloudinaryImgAPI }     from "../api/postCloudinaryImg.api";
import { sendActivationEmailAPI }   from "../api/sendActivationEmail.api";
import { checkExistingUserAPI } from "../api/checkExistingUser.api";

// styles
import "../styles/signup-styles.css"
import { Navigate } from "react-router-dom";
import { 
    BASE_FIRSTNAMES_MAX_LENGTH, 
    BASE_LASTNAMES_MAX_LENGTH, 
    BASE_PASSWORD_CONSTRAINTS, 
    BASE_USERNAME_CONSTRAINTS, 
    BASE_USERNAME_MAX_LENGTH, } from "../main";
import { FormField } from "../components/FormField";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserLogged } from "./UserLogged";


// constants


export function SignUp() {
    const {register, handleSubmit, formState: {errors}, watch} = useForm()
    let [userId, setUserId] = useState(null);
    let [username, setUsername] = useState(null);
    let [userEmail, setUserEmail] = useState(null);
    const onSubmit = handleSubmit(async (data) =>{
        try{
            const userAlreadyExists = await checkExistingUserAPI(data['username'], data['email'])
            if (userAlreadyExists.status === 200 && userAlreadyExists.data.existing === "false"){
                const photo = data['photo']
                delete data.confirmPwd // el confirmPwd no puede ser enviado al backend
                delete data.photo
                const uploadedImgData           = await postCloudinaryImgAPI(photo)
                data['photo_link']              = uploadedImgData.data.url // el serializer el backend recibe photo_link, no la foto en si
                const createUserResponse        = await createUsuarioAPI(data)
                setUserId(createUserResponse.data.new_user_id)
                setUsername(data.username)
                setUserEmail(data.email)
            } else {
                alert('Error comprobando existencia de usuario')
            }
        } catch(error){
            console.log('Error en procesamiento de formulario')
            console.log(error)
        }
    })
    const validatePassword = (confirmPwd) =>{
        /*
            Valida que las claves ingresadas sean iguales
        */
        if (confirmPwd != watch("password")){
            return "Las contrasenias no son iguales"
        }
    }
    if (userId && username && userEmail){ // si el usuario ya fue registrado
        const props = {
            'userId' : userId,
            'username' : username,
            'userEmail' : userEmail
        }
        return <Navigate to="/signup/activate/" state={props}/>
    } else{
        if (userIsAuthenticated()){
            return (
                <UserLogged/>
            )
        } else {
            return (
                <>
                <Header/>
                <form className="signup-form" onSubmit={onSubmit} method="POST" > 
                    <FormField label="Nombre de usuario" errors={errors.username &&  errors.username.message}>
                        <input 
                            defaultValue="aly999"
                            maxLength={BASE_USERNAME_MAX_LENGTH}
                            type="text" 
                            id="nombre" 
                            name="username"
                            {...register("username", BASE_USERNAME_CONSTRAINTS)}
                        />
                    </FormField>
                    <FormField label="Correo electronico" errors={errors.email &&  errors.email.message}>
                        <input 
                            defaultValue="aly@gmail.com"
                            type="email" 
                            id="email" 
                            name="email"
                            {...register("email", {
                                required:{
                                    value: true,
                                    message : "Por favor, ingresa tu correo electrónico"
                                },
                                pattern:{
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message : "Por favor, ingresa un correo electrónico valido"
                                }
                            })}
                        />
                    </FormField>
                    <FormField label="Nombres" errors={errors.first_names  && errors.first_names.message}>
                        <input 
                            defaultValue="Alayla Andreina"
                            maxLength={BASE_FIRSTNAMES_MAX_LENGTH}
                            type="text" 
                            id="first_names" 
                            name="first_names"
                            {...register("first_names", {
                                required:{
                                    value: true,
                                    message : "Por favor, ingresa tu(s) primer(os) nombre(s)"
                                },
                                pattern : {
                                    value :/^[^\d]+$/,
                                    message : "Por favor, ingresa un(os) nombre(s) valido(s)"
                                }
                            })}
                            />
                    </FormField>
                    <FormField label="Apellidos" errors={errors.last_names  && errors.last_names.message}>
                        <input 
                            defaultValue="Guzman Hurtado"
                            maxLength={BASE_LASTNAMES_MAX_LENGTH}
                            type="text" 
                            id="last_names" 
                            name="last_names"
                            {...register("last_names", {
                                required:{
                                    value: true,
                                    message : "Por favor, ingresa tu(s) apellido(s)" 
                                },
                                pattern : {
                                    value :/^[^\d]+$/,
                                    message : "Por favor, ingresa un(os) apellido(s) valido(s)"
                                }
                            })}
                            />
                    </FormField>
                    <FormField label="Edad" errors={errors.age  && errors.age.message}>
                        <input 
                            defaultValue="18"
                            type="number" 
                            id="age" 
                            name="age"
                            {...register("age", {
                                required:{
                                    value : true,
                                    message : "Por favor, ingresa tu edad."
                                },
                                max : {
                                    value : 120,
                                    message : "Por favor, ingresa una edad valida"
                                },
                                min : {
                                    value : 5,
                                    message : "Debes tener al menos 5 años"
                                },
                                pattern : {
                                    value : /^-?\d+$/,
                                    message : "Por favor, ingresa una edad valida"
                                }
                            })}
                            />
                    </FormField>
                    <FormField label="Foto de perfil" errors={errors.photo  && errors.photo.message}>
                        <input 
                            type="file"
                            id="photo" 
                            name="photo"
                            {...register("photo", {
                                required:{
                                    value : true,
                                    message : "Por favor, selecciona tu foto"
                                }
                            })}
                            />
                    </FormField>
                    <FormField label="Contraseña" errors={errors.password && errors.password.message}>
                        <input 
                            defaultValue="16102005 python"
                            type="password" 
                            id="password" 
                            name="password"
                            {...register("password", BASE_PASSWORD_CONSTRAINTS)}
                            />
                    </FormField>
                    <FormField label="Confirma la contraseña" errors={errors.confirmPwd  && errors.confirmPwd.message}>
                        <input 
                            defaultValue="16102005 python"
                            type="password" 
                            id="confirmPwd" 
                            name="confirmPwd"
                            {...register("confirmPwd", {
                                validate : validatePassword
                            })}
                            />
                    </FormField>
                    <button type="submit">enviar</button>
                </form>
                </>
            )
        }


        }

}
