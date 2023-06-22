import {Header} from "../components/Header.jsx"

export function Root() {
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
