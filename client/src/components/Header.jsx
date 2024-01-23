import "../styles/Header.css"
import {DarkModeButton} from "../components/DarkModeButton"
import {PropTypes} from "prop-types"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {Loader} from "../components/Loader"
/**
 * Cabecera estandar de la pagina
 * @param {String} msg mensaje a renderizar en conjunto con cabecera
 */
export function Header({msg}) {
    const userData = getUserDataFromLocalStorage()

    return (
        <>
            <DarkModeButton/>
            <header className="header-container">
                <h1 className="header-title">
                    FriendNet{userData && `, ${userData.username}`}
                </h1>
                {msg && <h2 className="header-msg">{msg}</h2>}
            </header>
            <Loader/>
        </>
    )
}



Header.propTypes = {
    msg : PropTypes.string
}
Header.defaultProps = {
    msg : undefined
}



