import { useEffect, useState } from "react"
import {Header} from "../components/Header.jsx"
import { userIsAuthenticated } from "../tools/userIsAuthenticated.js"
import { UserLogged } from "./UserLogged.jsx"
import { useNavigate } from "react-router-dom"

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
            <>
                <Header/>
                <section>
                    <div>
                        <h2>
                            Tienes cuenta? Logeate
                        </h2>
                        <button onClick={()=>setGotToLogin(true)}>
                            Logearme 
                        </button>
                    </div>
                    <div>
                        <h2>
                            Aun no tienes cuenta? Registrate
                        </h2>
                        <button onClick={()=>setGoToSignUp(true)}>
                            Registrarme
                        </button>
                    </div>
                </section>
            </>
        )
    }
}
