import "../styles/Header.css"
import {PropTypes} from "prop-types"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
/**
 * Cabecera estandar de la pagina
 * @param {String} msg mensaje a renderizar en conjunto con cabecera
 */
export function Header({msg}) {
    const userData = getUserDataFromLocalStorage()

    return (
        <>
            <header className="header-container">
                <h1 className="header-title">
                    <span className="header-logo-container">
                        <img className="header-logo" src="/logo3.png"/>
                    </span>
                    riendNet{userData && `, ${userData.username}`}
                </h1>
                {msg && <h2 className="header-msg">{msg}</h2>}
            </header>
        </>
    )
}



Header.propTypes = {
    msg : PropTypes.string
}
Header.defaultProps = {
    msg : undefined
}



