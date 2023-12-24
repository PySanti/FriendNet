import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"
import "../styles/UserLogged.css"
import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"


/**
 * Pagina a renderizar cuando el usuario trata de acceder a pages
 * para logeo, activacion o registro estando ya logeado
 */
export function UserLogged(){
    const navigate = useNavigate()
    useEffect(()=>{
        document.title = generateDocumentTitle("")
    }, [])
    return (
        <div className="centered-container">
            <div className="user-logged-container">
                <Header msg="Ya estas autenticado, ve al Home"/>
                <Button buttonText="Home" onClickFunction={()=>{navigate('/home/')}}/>
            </div>
        </div>
    )
}