import {PropTypes} from "prop-types"



/**
 * Filtro de busqueda de usuarios
 * @param {Array} initialUsersList
 * @param {Function} usersListSetter 
 * @param {String} sessionUserId 
 */
export function UserFilter({userList, userKeyword, userKeywordSetter}){
    const onLetterInput = (e)=>{
        // optimizacion
        if (!userKeyword || e.target.value.length <= userKeyword.length || userList.length > 0){
            userKeywordSetter(e.target.value)
        }
    }
    return (
        <input placeholder="Busca a un usuario" className="users-filter-input" type="text" onChange={onLetterInput}/>
    )
}
UserFilter.propTypes = {
    userList  : PropTypes.array.isRequired,
    userKeyword : PropTypes.string,
    userKeywordSetter : PropTypes.func.isRequired
}