/**
 * Cabecera estandar de la pagina
 * @param {String} username nombre de usuario logeado
 * @param {String} msg mensaje de renderizar en conjunto con cabecera
 */
export function Header({username, msg}) {
    return (
        <header>
            <h1>
                Welcome to friendNet{username && `, ${username}`}
            </h1>
            <p>
                Chat with the people you want !
            </p>
            {msg && 
            <h2>
                {msg}
            </h2>
            }
        </header>
    )
}
