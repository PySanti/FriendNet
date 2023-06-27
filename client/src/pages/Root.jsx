import {Header} from "../components/Header.jsx"
import { userIsAuthenticated } from "../tools/userIsAuthenticated.js"
import { UserLogged } from "./UserLogged.jsx"

export function Root() {
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
                        <button>
                            <a href="login/">logear</a>
                        </button>
                    </div>
                    <div>
                        <h2>
                            Aun no tienes cuenta? Registrate
                        </h2>
                        <button>
                            <a href="signup/">registrar</a>
                        </button>
                    </div>
                </section>
            </>
        )
    }
}
