import { UserButton } from "./UserButton"
import {PropTypes} from "prop-types"
import "../styles/UsersList.css"
import { v4 } from "uuid"

/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 * @param {Array} usersList lista de usuarios
 * @param {Function} onClickEvent evento a ejecutar cuando los usersButtons sean presionados
 * @param {Array} chatGlobeList lista de ids de los usuarios con globe en la usersList
 */
export function UsersList({usersList, onClickEvent, chatGlobeList}){
    const formatingFunction = (user)=>{
        return <UserButton key={v4()}user={user}onClickFunction={onClickEvent} withGlobe={chatGlobeList.includes(user.id)} />
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
    onClickEvent : PropTypes.func.isRequired,
    chatGlobeList : PropTypes.array
}
UsersList.defaultProps = {
    chatGlobeList : undefined
}



