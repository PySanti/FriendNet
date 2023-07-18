import { UserButton } from "./UserButton"
import {PropTypes} from "prop-types"
import "../styles/UsersList.css"

/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 * @param {Array} usersList lista de usuarios
 * @param {Function} onClickEvent evento a ejecutar cuando los usersButtons sean presionados
 */
export function UsersList({usersList, onClickEvent}){
    const formatingFunction = (user)=>{
        return <UserButton key={user.username}user={user}onClickFunction={onClickEvent} />
    }
    return (
        <>
            <div className="users-list-container">
                {usersList.map(formatingFunction)}
            </div>
        </>
    )
}


UsersList.propTypes = {
    usersList : PropTypes.array.isRequired,
    onClickEvent : PropTypes.func.isRequired
}

