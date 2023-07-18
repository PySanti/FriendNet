import {PropTypes} from "prop-types"
import "../styles/UserButton.css"
/**
 * Retorna un userButton, button a renderizar en la UsersList
 * @param {Object} user
 * @param {Function} onClickFunction
 */
export function UserButton({user, onClickFunction}){
    return (
        <button className="user-button"onClick={()=>onClickFunction(user)}>
            {user.username}
            {user.is_online && ", en linea"}
        </button>
    )
}

UserButton.propTypes = {
    user : PropTypes.object.isRequired,
    onClickFunction : PropTypes.func.isRequired,
}