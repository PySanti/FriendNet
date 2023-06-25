import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { userIsAuthenticated } from "../tools/userIsAuthenticated"
import { UserNotLogged } from "./UserNotLogged"
export function Home() {
    const {user, logoutUser} = useContext(AuthContext)
    if (userIsAuthenticated()){
        return (
            <>
                <h1>
                    Bienvenidos a FriendNet, {user.username}
                </h1>
                <button onClick={logoutUser}>Salir</button>
            </>
        )
    } else {
        return <UserNotLogged/>
    }

}