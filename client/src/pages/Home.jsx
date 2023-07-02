import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
import { Header } from "../components/Header"
import { useNavigate } from "react-router-dom"
import { getUsersListAPI } from "../api/getUsersList.api"
/**
 * Pagina principal del sitio
 */
export function Home() {
    const {user, logoutUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const [userList, setUserList] = useState([])
    const loadUsersList = async ()=>{
        try{
            const response = await getUsersListAPI()
            setUserList(response.data)
            console.log(userList)
        } catch(error){
            console.log(error)
        }
    }
    let [goToProfile, setGoToProfile] = useState(false)
    useEffect(()=>{
        if(goToProfile){
            navigate("/home/profile/")
        }
    }, [goToProfile])
    useEffect(()=>{
        if (userIsAuthenticated()){
            loadUsersList()
        }
    }, [])
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