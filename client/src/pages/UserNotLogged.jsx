import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

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
        <h1>Aun no estas logeado</h1>
        <button onClick={()=>setBackToRoot(true)}>
            Logearme
        </button>
        </>
    )
}