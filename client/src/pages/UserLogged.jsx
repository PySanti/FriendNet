import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"

export function UserLogged(props){
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
        <>
            <Header msg="Ya estas autenticado, ve al Home"/>
            <button onClick={()=>setBackToHome(true)}>Home</button>
        </>
    )
}