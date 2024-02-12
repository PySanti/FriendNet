import "../styles/Header.css"
import {PropTypes} from "prop-types"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {useDarkMode} from "../store"
/**
 * Cabecera estandar de la pagina
 * @param {String} msg mensaje a renderizar en conjunto con cabecera
 */
export function Header({msg}) {
    const userData = getUserDataFromLocalStorage()
    let darkModeActivated  = useDarkMode((state)=>(state.darkModeActivated))
    return (
        <>
            <header className="header-container">
                <div className="header-title-container">
                    <h1 className="header-content">
                        <img className="header-logo" src={!darkModeActivated ? "/logo3V3.png" : "/logo3V3Inverted.png"}/>
                        riendNet{userData && `, ${userData.username}`}
                    </h1>
                </div>
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



