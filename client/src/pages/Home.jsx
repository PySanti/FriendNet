import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
/**
 * Pagina principal del sitio
 */
export function Home() {
    const {user, logoutUser} = useContext(AuthContext)
    const navigate = useNavigate()
    let [goToProfile, setGoToProfile] = useState(false)
    useEffect(()=>{
        if(goToProfile){
            navigate("/home/profile/")
        }
    }, [goToProfile])
    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else {
        return (
            <>
                <Header username={user.username}/>
                <button onClick={logoutUser}>Salir</button>
                <button onClick={()=>{setGoToProfile(true)}}>Perfil</button>
            </>
        )
    }
}