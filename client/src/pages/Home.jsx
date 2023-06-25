import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
export function Home() {
    const context = useContext(AuthContext)
    console.log(context)
    return (
        <h1>
            Bienvenidos a FriendNet, 
        </h1>
    )
}