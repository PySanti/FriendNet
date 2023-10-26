import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"


/**
 * Page a renderizar cuando el usuario trate de acceder a una pagina a la que debe
 * estar logeado sin estarlo
 */
export function UserNotLogged(){
    const navigate = useNavigate()
    return (
        <div className="centered-container">
            <div className="usernot-logged-container">
                <Header msg="Aun no estas logeado"/>
                <Button buttonText="Logearme" onClickFunction={()=> {navigate('/')}}/>
            </div>
        </div>
    )
}