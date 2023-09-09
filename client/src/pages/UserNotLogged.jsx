import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"


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