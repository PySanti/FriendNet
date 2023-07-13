/**
 * Retorna un userButton
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