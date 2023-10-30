import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"
import "../styles/UserLogged.css"
import {userIsAuthenticated} from "../utils/userIsAuthenticated"
import {UserNotLogged} from "./UserNotLogged"
/**
 * Pagina creada para ser renderizada cuando el usuario acceda 
 * a una ruta inexistente
 */
export function Page404(){
    const navigate = useNavigate()
    if (userIsAuthenticated()){
        return (
            <div className="centered-container">
                <div className="page-404-container">
                    <Header msg="Pagina no encontrada, ve al Home"/>
                    <Button buttonText="Home" onClickFunction={()=>{navigate('/home/')}}/>
                </div>
            </div>
        )
    } else {
        return <UserNotLogged msg="Pagina no encontrada :("/>
    }
}