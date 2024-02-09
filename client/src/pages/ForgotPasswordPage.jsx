import {EmailField} from "../components/EmailField"
import {Form} from "../components/Form"
import {Header} from "../components/Header"
import { useForm } from "react-hook-form";
import {BASE_EMAIL_CONSTRAINTS} from "../utils/constants"
import {toastedApiCall} from "../utils/toastedApiCall"
import {useNavigate} from "react-router-dom"
import {Button} from "../components/Button"

export function ForgotPasswordPage(){
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}}  = useForm()
    const handleUsernameInput = async (data)=>{
        let response = await toastedApiCall(async ()=>{
        }, navigate, 'Buscando usuario')
    }
    return (
            <div className="centered-container">
                <div className="login-container">
                    <Header msg="Recuperando cuenta"/>
                    <Form onSubmitFunction={handleSubmit((data)=>{handleUsernameInput(data)})} buttonMsg={"Buscar"} buttonsList={<Button onClickFunction={()=>navigate("/login/")} back/>}>
                        <EmailField errors={errors.email && errors.email.message} registerObject={register("email", BASE_EMAIL_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
    )
}