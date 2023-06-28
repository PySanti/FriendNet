import { useForm } from "react-hook-form"
import { BASE_FIRSTNAMES_MAX_LENGTH, BASE_LASTNAMES_MAX_LENGTH, BASE_PASSWORD_CONSTRAINTS, BASE_USERNAME_CONSTRAINTS, BASE_USERNAME_MAX_LENGTH } from "../main"
import { FormField } from "./FormField"

export function UserDataForm(props){
    /**
     * Componente creado para SignUp.jsx y EditProfile.jsx
     * Retorna un formulario con soporte para errores que funcionara
     * tanto para actualizar como para registrar un usuario
     * 
     */
    const {register, handleSubmit, formState: {errors}, watch}  = useForm()
    const onSubmit = handleSubmit((data)=>{
        props.onSubmitFunction(data)
    })
    return (
            <form className="signup-form" onSubmit={onSubmit} method={props.method} > 
                <FormField label="Nombre de usuario" errors={errors.username &&  errors.username.message}>
                    <input 
                        defaultValue={props.userData && props.userData.username}
                        maxLength={BASE_USERNAME_MAX_LENGTH}
                        type="text" 
                        id="username" 
                        name="username"
                        {...register("username", BASE_USERNAME_CONSTRAINTS)}
                    />
                </FormField>
                <FormField label="Correo electronico" errors={errors.email &&  errors.email.message}>
                    <input 
                        defaultValue={props.userData && props.userData.email}
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
                        defaultValue={props.userData && props.userData.first_names}
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
                        defaultValue={props.userData && props.userData.last_names}
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
                        defaultValue={props.userData && props.userData.age}
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
                {!props.updating && 
                    <>
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
                                    validate : (confirmPwd) =>{
                                        if (confirmPwd != watch("password")){
                                            return "Las contrasenias no son iguales"
                                        }
                                    }
                                })}
                                />
                        </FormField>
                        <button type="submit">registrar</button>
                    </>
                }
                {props.updating && 
                    <button type="submit">actualizar</button>
                }
            </form>
    )
}