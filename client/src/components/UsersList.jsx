import { UserButton } from "./UserButton"

/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 * @param {Array} usersList lista de usuarios
 * @param {Function} onClickEvent evento a ejecutar cuando los usersButtons sean presionados
 */
export function UsersList({usersList, onClickEvent}){
    const formatingFunction = (user)=>{
        return <UserButton key={user.username}user={user}onClickFunction={onClickEvent} />
    }
    const compList = usersList.map(formatingFunction)
    return (
        <>
            <div className="users-container">
                {compList}
            </div>
        </>
    )
}