import {PropTypes} from "prop-types"
import "../styles/UserFilter.css"
import {useUsersList} from "../store/usersListStore"


/**
 * Filtro de busqueda de usuarios
 * @param {Function} userKeyword 
 * @param {String} userKeywordSetter 
 */
export function UserFilter({userKeyword, userKeywordSetter}){
    const userList = useUsersList((state)=>state.usersList)
    const onLetterInput = (e)=>{
        // optimizacion
        if (!userKeyword || e.target.value.length <= userKeyword.length || userList.length > 0){
            userKeywordSetter(e.target.value)
        }
    }
    return (
        <div className="user-filter-container">
            <input placeholder="Busca a un usuario" className="users-filter-input" type="text" onChange={onLetterInput}/>
        </div>
    )
}
UserFilter.propTypes = {
    userKeyword : PropTypes.string,
    userKeywordSetter : PropTypes.func.isRequired
}