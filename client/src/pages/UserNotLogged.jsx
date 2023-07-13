import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"

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
            <Header msg="Aun no estas logeado"/>
            <Button msg="Logearme" onClickFunction={()=>setBackToRoot(true)}/>
        </div>
    )
}