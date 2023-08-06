import { UserButton } from "./UserButton"
import {PropTypes} from "prop-types"
import "../styles/UsersList.css"
import { v4 } from "uuid"
import { UserFilter } from "./UserFilter"

/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 * @param {Array} usersList lista de usuarios
 * @param {Function} onClickEvent evento a ejecutar cuando los usersButtons sean presionados
 * @param {Array} chatGlobeList lista de ids de los usuarios con globe en la usersList
 * @param {Function} usersListSetter setter de lista de usuarios a usar con filtro
 * @param {String} accessToken token de acceso de usuario
 */
export function UsersList({usersList, onClickEvent, chatGlobeList, usersListSetter, accessToken}){
    const formatingFunction = (user)=>{
        return <UserButton key={v4()}user={user}onClickFunction={onClickEvent} withGlobe={chatGlobeList.includes(user.id)} />
    }
    return (
        <>
            <div className="users-list-container">
                <UserFilter usersListSetter={usersListSetter} accessToken={accessToken}/>
                {usersList.length > 0 ? 
                    usersList.map(formatingFunction)
                    :
                    <div className="no-users-msg">
                        No se han encontrado usuarios
                    </div>
                }
            </div>
        </>
    )
}


UsersList.propTypes = {
    usersList : PropTypes.array.isRequired,
    onClickEvent : PropTypes.func.isRequired,
    chatGlobeList : PropTypes.array,
    usersListSetter : PropTypes.func.isRequired,
    accessToken : PropTypes.string.isRequired
}
UsersList.defaultProps = {
    chatGlobeList : undefined,
}



