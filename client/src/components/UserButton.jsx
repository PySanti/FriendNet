/**
 * Retorna un userButton
 * @param {String} username
 * @param {String} id
 * @param {Function} onClickFunction
 * @param {Boolean} isOnline
 */
export function UserButton({username, id, onClickFunction, isOnline}){
    return (
        <button className="user-button"onClick={()=>onClickFunction(id)}>
            {username}
            {isOnline && ", en linea"}
        </button>
    )
}