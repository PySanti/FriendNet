import {PropTypes} from "prop-types"
import "../styles/UserButton.css"
/**
 * Retorna un userButton, button a renderizar en la UsersList
 * @param {Object} user
 * @param {Function} onClickFunction
 * @param {Boolean} withGlobe sera true en caso de que se quiera renderizar el button con globo de notificacion
 */
export function UserButton({user, onClickFunction, withGlobe}){
    return (
        <button className="user-button"onClick={()=>onClickFunction(user)}>
            {user.username}{user.is_online && ", en linea"}
            {withGlobe &&<div className="user-button-globe">x</div>}
        </button>
    )
}

UserButton.propTypes = {
    user : PropTypes.object.isRequired,
    onClickFunction : PropTypes.func.isRequired,
    withGlobe : PropTypes.bool,
}
UserButton.defaultProps = {
    withGlobe : undefined
}