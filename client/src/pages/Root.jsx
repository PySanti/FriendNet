import { useEffect, useState } from "react"
import {Header} from "../components/Header.jsx"
import { userIsAuthenticated } from "../tools/userIsAuthenticated.js"
import { UserLogged } from "./UserLogged.jsx"
import { useNavigate } from "react-router-dom"
import "../styles/Root.css"
import { Button } from "../components/Button.jsx"
/**
 * Pagina de inicio
 */
export function Root() {
    const [goToLogin, setGotToLogin] = useState(false)
    const [goToSignUp, setGoToSignUp] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        if (goToLogin){
            navigate('/login/')
        }
    }, [goToLogin])
    useEffect(()=>{
        if (goToSignUp){
            navigate('/signup/')
        }
    }, [goToSignUp])
    if (userIsAuthenticated()){
        return <UserLogged/>
    }else{
        return (
            <div className="centered-container">
                <div className="root-container">
                    <Header msg="Chatea con quien quieras !"/>
                    <section className="redirect-container">
                        <div className="signin-container">
                            <div className="signin-cotainer__title-container">
                                <h4 className="signin-container__title">
                                    Tienes cuenta? 
                                </h4>
                            </div>
                            <Button buttonText="Logearme" onClickFunction={()=>setGotToLogin(true)}/>
                        </div>
                        <div className="signup-container">
                            <h4>
                                Aun no tienes cuenta? 
                            </h4>
                            <Button buttonText="Registrarme" onClickFunction={()=>setGoToSignUp(true)} />
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
