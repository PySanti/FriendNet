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
 * @param {Function} gottaUpdateListSetter setter para avisar cuando sea necesario actualizar lista de usuarios
 * @param {Boolean} loaderActivated booleano que indicara si es necesario renderizar loader para carga de usuarios de la lista
 * @param {String} userKeyword palabra clave actual para userFilter
 * @param {Function} userKeywordSetter state setter de palabra clave actual para userFilter
 */
export function UsersList({usersList, onClickEvent, chatGlobeList, gottaUpdateListSetter, loaderActivated, userKeyword, userKeywordSetter }){
    const loaderClassName = "users-list-loader"
    const formatingFunction = (user)=>{
        return <UserButton key={v4()}user={user}onClickFunction={onClickEvent} withGlobe={chatGlobeList.includes(user.id)} />
    }
    const scrollDetector = (e)=>{
        if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight/1.01){
            console.log('Se llego al final de la lista!')
            gottaUpdateListSetter(true)
        } 
    }
    return (
        <>
            <div className="users-list">
                <UserFilter userList={usersList} userKeyword={userKeyword} userKeywordSetter={userKeywordSetter} />
                {usersList.length > 0 ? 
                    <div className="users-list-container"  onScroll={scrollDetector}>
                        {usersList.map(formatingFunction)}
                    </div>
                    :
                    <div className="no-users-msg">
                        No se han encontrado usuarios
                    </div>
                }
                <div className={loaderActivated ? loaderClassName+"__activated" : loaderClassName}>
                    {loaderActivated && "Cargando ..."}
                </div>
            </div>
        </>
    )
}


UsersList.propTypes = {
    usersList : PropTypes.array.isRequired,
    onClickEvent : PropTypes.func.isRequired,
    chatGlobeList : PropTypes.array,
    gottaUpdateListSetter : PropTypes.func.isRequired,
    loaderActivated : PropTypes.bool.isRequired,
    userKeyword : PropTypes.string,
    userKeywordSetter : PropTypes.func.isRequired,

}
UsersList.defaultProps = {
    chatGlobeList : undefined,
}


