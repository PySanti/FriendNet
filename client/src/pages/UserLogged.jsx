import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"
import "../styles/UserLogged.css"

export function UserLogged(){
    /**
     *  Pagina creada para devolver cuando el usuario ya este autenticado
     */
    const [backToHome, setBackToHome] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        if(backToHome){
            navigate('/home/')
        }
    }, [backToHome])
    return (
        <div className="centered-container">
            <div className="user-logged-container">
                <Header msg="Ya estas autenticado, ve al Home"/>
                <Button buttonText="Home" onClickFunction={()=>setBackToHome(true)}/>
            </div>
        </div>
    )
}