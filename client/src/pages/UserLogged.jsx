import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"
import "../styles/UserLogged.css"


export function UserLogged(){
    const navigate = useNavigate()
    return (
        <div className="centered-container">
            <div className="user-logged-container">
                <Header msg="Ya estas autenticado, ve al Home"/>
                <Button buttonText="Home" onClickFunction={()=>{navigate('/home/')}}/>
            </div>
        </div>
    )
}