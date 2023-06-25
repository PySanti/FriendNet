import { useParams } from "react-router-dom"
import { Header } from "../components/Header"
import { useForm } from "react-hook-form"
export function AccountActivation() {
    const {userActivationCode} = useParams()
    const {register, handleSubmit, formState:{errors}} = useForm()
    const onSubmit = handleSubmit((data)=>{
        if (Number(data.activation_code) === Number(userActivationCode)){
            console.log("Activar usuario")
        }
    })
    return (
        <>
            <Header/>
            <div>
                <h1>
                    Ingresa el código de activación
                </h1>
                <form onSubmit={onSubmit}>
                    {errors.activation_code && <p>{errors.activation_code.message}</p>}
                    <label>codigo : </label>
                    <input 
                        type="text"
                        maxLength={6}
                        minLength={1}
                        name="activation_code"
                        id="activation_code"
                        {...register("activation_code", {
                            required : {
                                value : true,
                                message : "Por favor ingresa un código de activación"
                            },
                            pattern : {
                                value : /^-?\d+$/,
                                message : "Por favor, ingresa un codigo valido"
                            },
                            minLength : {
                                value : 6,
                                message : 'Debes ingresar al menos 6 caracteres',
                            }
                            })}
                    />
                    <button type="submit">enviar</button>
                </form>
                    </div>
                </>
        )
}
