import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"
import "../styles/UserLogged.css"
import { getUserDataFromLocalStorage } from "../utils/getUserDataFromLocalStorage"



export function UserLogged(){
    const navigate = useNavigate()
    return (
        <div className="centered-container">
            <div className="user-logged-container">
                <Header username={getUserDataFromLocalStorage().username} msg="Ya estas autenticado, ve al Home"/>
                <Button buttonText="Home" onClickFunction={()=>{navigate('/home/')}}/>
            </div>
        </div>
    )
}