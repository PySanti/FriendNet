import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"
import "../styles/UserNotLogged.css"
export function UserNotLogged(){
    const [backToRoot, setBackToRoot] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        if(backToRoot){
            navigate('/')
        }
    }, [backToRoot])
    return (
        <div className="centered-container">
            <div className="usernot-logged-container">
                <Header msg="Aun no estas logeado"/>
                <Button buttonText="Logearme" onClickFunction={()=>setBackToRoot(true)}/>
            </div>
        </div>
    )
}