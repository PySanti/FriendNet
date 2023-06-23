import { Header } from "../components/Header";
import { Navigate } from "react-router-dom";
import {useForm} from "react-hook-form"
import { createUsuario } from "../api/createUsuario.api.js";
import "../styles/signup-styles.css"

export function SignUp() {
    const {register, handleSubmit, formState: {errors}} = useForm()
    const onSubmit = handleSubmit(async (data) =>{
        console.log(data)
        const res = await createUsuario(data)
        console.log(res)
        return <Navigate to="signup-activate"></Navigate>
    })
    return (
        <>
        <Header/>
        <form  onSubmit={onSubmit} method="POST" encType="multipart/form-data"  > 
            {errors.username && <p>introduce el nombre de usuario pana</p>}
            {errors.email && <p>introduce el correo de usuario pana</p>}
            {errors.password && <p>introduce la contrasenia</p>}
            <label>
                Nombre de usuario:
                <input 
                    defaultValue="aly99"
                    type="text" 
                    id="nombre" 
                    name="username"
                    {...register("username", {
                        required:true
                    })}
                />
            </label>
            <label>
                Correo electrónico:
                <input 
                    defaultValue="santi@gmail.com" 
                    type="email" 
                    id="email" 
                    name="email"
                    {...register("email", {
                        required:true
                    })}
                />
            </label>
            <label>
                Contraseña : 
                <input 
                    defaultValue="16102005" 
                    type="password" 
                    id="password" 
                    name="password"
                    {...register("password", {
                        required:true
                    })}
                    />
            </label>
            <label>
                Primer(os) Nombre(s) : 
                <input 
                    defaultValue="Alayla" 
                    type="text" 
                    id="first_names" 
                    name="first_names"
                    {...register("first_names", {
                        required:true
                    })}
                    />
            </label>
            <label>
                Apellido (s): 
                <input 
                    defaultValue="Guzman" 
                    type="text" 
                    id="last_names" 
                    name="last_names"
                    {...register("last_names", {
                        required:true
                    })}
                    />
            </label>
            <label>
                Edad : 
                <input 
                    defaultValue="18" 
                    type="number" 
                    id="age" 
                    name="age"
                    {...register("age", {
                        required:true
                    })}
                    />
            </label>
            <label>
                Foto : 
                <input 
                    type="file" 
                    id="photo" 
                    name="photo"
                    {...register("photo", {
                        required:true
                    })}
                    />
            </label>
            <button type="submit">enviar</button>
        </form>
        </>
    )
}
