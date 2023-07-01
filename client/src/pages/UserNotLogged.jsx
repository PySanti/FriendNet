import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"

export function UserNotLogged(){
    const [backToRoot, setBackToRoot] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        if(backToRoot){
            navigate('/')
        }
    }, [backToRoot])
    return (
        <>
        <Header msg="Aun no estas autenticado"/>
        <button onClick={()=>setBackToRoot(true)}>Logearme</button>
        </>
    )
}