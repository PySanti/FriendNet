import {PropTypes} from "prop-types"
import "../styles/UserFilter.css"



/**
 * Filtro de busqueda de usuarios
 * @param {Array} userList
 * @param {Function} userKeyword 
 * @param {String} userKeywordSetter 
 */
export function UserFilter({userList, userKeyword, userKeywordSetter}){
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
    userList  : PropTypes.array.isRequired,
    userKeyword : PropTypes.string,
    userKeywordSetter : PropTypes.func.isRequired
}