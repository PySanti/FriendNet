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
 * @param {String} sessionUserId 
 * @param {Function} gottaUpdateListSetter setter para avisar cuando sea necesario actualizar lista de usuarios
 * @param {Boolean} loaderActivated booleano que indicara si es necesario renderizar loader para carga de usuarios de la lista
 */
export function UsersList({usersList, onClickEvent, chatGlobeList, usersListSetter, sessionUserId, gottaUpdateListSetter, loaderActivated }){
    const formatingFunction = (user)=>{
        return <UserButton key={v4()}user={user}onClickFunction={onClickEvent} withGlobe={chatGlobeList.includes(user.id)} />
    }
    const scrollDetector = (e)=>{
        if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight){
            console.log('Se llego al final de la lista!')
            gottaUpdateListSetter(true)
        }
    }
    return (
        <>
            <div className="users-list-container" onScroll={scrollDetector}>
                <UserFilter usersListSetter={usersListSetter} sessionUserId={sessionUserId} initialUsersList={usersList}/>
                {usersList.length > 0 ? 
                    usersList.map(formatingFunction)
                    :
                    <div className="no-users-msg">
                        No se han encontrado usuarios
                    </div>
                }
                {loaderActivated &&
                    "Cargando ..."
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
    sessionUserId : PropTypes.number.isRequired,
    gottaUpdateListSetter : PropTypes.func.isRequired,
    loaderActivated : PropTypes.bool.isRequired,

}
UsersList.defaultProps = {
    chatGlobeList : undefined,
}


