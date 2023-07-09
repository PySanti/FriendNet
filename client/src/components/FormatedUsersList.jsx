import { UserButton } from "./UserButton"

/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 * @param {Array} usersList lista de usuarios
 * @param {Function} onClickEvent evento a ejecutar cuando los usersButtons sean presionados
 */
export function FormatedUsersList({usersList, onClickEvent}){
    const list=usersList.map((user)=>{
        return <UserButton key={user.username}username={user.username} id={user.id} isOnline={user.is_online} onClickFunction={onClickEvent} />
    })
    return (
    <>
        <div className="users-container">
            {list}
        </div>
    </>
    )

}