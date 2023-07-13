import "../styles/Header.css"
/**
 * Cabecera estandar de la pagina
 * @param {String} username nombre de usuario logeado
 * @param {String} msg mensaje de renderizar en conjunto con cabecera
 */
export function Header({username, msg}) {
    return (
        <header className="header-container">
            <h1 className="header-title">
                FriendNet{username && `, ${username}`}
            </h1>
            {/* {msg && <h2 className="header-msg">{msg}</h2>} */}
            <h2 className="header-msg">Saludos terricolas</h2>
        </header>
    )
}
