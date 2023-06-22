import { Header } from "../components/Header"
import {BACKEND_URL} from "../main.jsx"


export function Login() {
    return (
        <>
            <Header/>
            <form action={BACKEND_URL+"/login"} method="POST">
                <input type="text"></input>
                <input type="password"></input>
                <button type="submit">acceder</button>
            </form>
        </>
    )
}
