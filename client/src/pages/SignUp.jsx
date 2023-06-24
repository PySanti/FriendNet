// react modules
import { Header }                   from "../components/Header";
import { Navigate }                 from "react-router-dom";
import {useForm}                    from "react-hook-form"
// api's
import { createUsuarioAPI }         from "../api/createUsuario.api";
import { postCloudinaryImgAPI }     from "../api/postCloudinaryImg.api";
import { sendActivationEmailAPI }   from "../api/sendActivationEmail.api";

// styles
import "../styles/signup-styles.css"

export function SignUp() {
    const {register, handleSubmit, formState: {errors}, watch} = useForm()
    const onSubmit = handleSubmit(async (data) =>{
        try{
            const photo = data['photo']
            delete data.confirmPwd // el confirmPwd no puede ser enviado al backend
            delete data['photo']
            const uploadedImgData           = await postCloudinaryImgAPI(photo)
            data['photo_link']              = uploadedImgData.data.url // el serializer el backend recibe photo_link, no la foto en si
            const userActivationCode        = await sendActivationEmailAPI(data.email, data.username)
            await createUsuarioAPI(data)
            // redireccionar a pagina de activacion
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
    return (
        <>
        <Header/>
        <form className="signup-form" onSubmit={onSubmit} method="POST" encType="multipart/form-data"  > 
            {errors.username &&   <p>{errors.username.message}</p>}
            <label>
                Nombre de usuario:
                <input 
                    defaultValue="aly999"
                    maxLength={15}
                    type="text" 
                    id="nombre" 
                    name="username"
                    {...register("username", {
                        required: {
                            value : true,
                            message : "Por favor, ingresa el nombre de tu usuario"
                        },
                        minLength : {
                            value : 6,
                            message : "Por favor, ingresa un usuario con al menos 6 caracteres"
                        }
                    })}
                />
            </label>
            {errors.email   &&   <p>{errors.email.message}</p>}
            <label>
                Correo electrónico:
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
            </label>
            {errors.first_names  &&   <p>{errors.first_names.message}</p>}
            <label>
                Primer(os) Nombre(s) : 
                <input 
                    defaultValue="Alayla Andreina"
                    maxLength={30}
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
            </label>
            {errors.last_names  &&   <p>{errors.last_names.message}</p>}
            <label>
                Apellido (s): 
                <input 
                    defaultValue="Guzman Hurtado"
                    maxLength={30}
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
            </label>
            {errors.age  &&   <p>{errors.age.message}</p>}
            <label>
                Edad : 
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
                        }
                    })}
                    />
            </label>
            {errors.photo  &&   <p>{errors.photo.message}</p>}
            <label>
                Foto : 
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
            </label>
            {errors.password &&   <p>{errors.password.message}</p>}
            <label>
                Contraseña : 
                <input 
                    defaultValue="16102005 python"
                    type="password" 
                    id="password" 
                    name="password"
                    {...register("password", {
                        required:{
                            value: true,
                            message : "Por favor, ingresa una contraseña"
                        },
                        minLength : {
                            value : 10,
                            message : "Por favor, ingresa una contraseña con al menos 10 caracteres"
                        }
                    })}
                    />
            </label>
            {errors.confirmPwd  &&   <p>{errors.confirmPwd.message}</p>}
            <label>
                Contraseña (nuevamente): 
                <input 

                    defaultValue="16102005 python"
                    type="password" 
                    id="confirmPwd" 
                    name="confirmPwd"
                    {...register("confirmPwd", {
                        validate : validatePassword
                    })}
                    />
            </label>
            <button type="submit">enviar</button>
        </form>
        </>
    )
}
