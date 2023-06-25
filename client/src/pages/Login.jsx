import { useForm } from "react-hook-form"
import { Header } from "../components/Header"
import {BACKEND_URL} from "../main.jsx"


export function Login() {
    const {register, handleSubmit, formState : {errors}} = useForm()
    const onSubmit = handleSubmit((data)=>{
        console.log('Logeando usuario')
        console.log(data)
    })
    return (
        <>
            <Header/>
            <form onSubmit={onSubmit}>
                
                <input type="text"></input>
                <input type="password"></input>
                <button type="submit">acceder</button>
            </form>
        </>
    )
}
