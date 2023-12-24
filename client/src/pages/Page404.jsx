import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"
import "../styles/UserLogged.css"
import {userIsAuthenticated} from "../utils/userIsAuthenticated"
import {UserNotLogged} from "./UserNotLogged"
import {BASE_PAGE_NOT_FOUND_LOG} from "../utils/constants"
import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"

/**
 * Pagina creada para ser renderizada cuando el usuario acceda 
 * a una ruta inexistente
 */
export function Page404(){
    const navigate = useNavigate()
    useEffect(()=>{
        document.title = generateDocumentTitle("404")
    }, [])
    if (userIsAuthenticated()){
        return (
            <div className="centered-container">
                <div className="page-404-container">
                    <Header msg={BASE_PAGE_NOT_FOUND_LOG}/>
                    <Button buttonText="Home" onClickFunction={()=>{navigate('/home/')}}/>
                </div>
            </div>
        )
    } else {
        return <UserNotLogged msg={BASE_PAGE_NOT_FOUND_LOG}/>
    }
}