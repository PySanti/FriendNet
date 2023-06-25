import { useForm } from "react-hook-form"
import { Header } from "../components/Header"


export function Login() {
    const {register, handleSubmit, formState : {errors}} = useForm()
    const onSubmit = handleSubmit((data)=>{
    })
    return (
        <>
            <Header/>
            <form onSubmit={onSubmit} method="POST">
                {errors.username && <p>{errors.username.message}</p>}
                <label>
                    Usuario:
                    <input 
                        maxLength={15}
                        type="text"
                        id="username"
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
                {errors.password && <p>{errors.password.message}</p>}
                <label>
                    Contraseña:
                    <input 
                        id="password"
                        name="password"
                        type="password"
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
                <button type="submit">acceder</button>
            </form>
        </>
    )
}
