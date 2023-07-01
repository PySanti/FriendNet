import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function UserLogged(props){
    /**
     *  Pagina creada para devolver cuando el usuario ya este autenticado
     */
    const [backToRoot, setBackToRoot] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        if(backToRoot){
            navigate('/home/')
        }
    }, [backToRoot])
    return (
        <>
            <h1>Ya estas autenticado, ve al Home</h1>
            <button onClick={()=>setBackToRoot(true)}>
                Home
            </button>
        </>
    )
}