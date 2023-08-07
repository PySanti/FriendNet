import { getUsersListAPI } from "../api/getUsersList.api"
import {PropTypes} from "prop-types"
import { useEffect, useState } from "react"



/**
 * Filtro de busqueda de usuarios
 * @param {Function} usersListSetter 
 * @param {String} sessionUserId 
 */
export function UserFilter({usersListSetter, sessionUserId}){
    let [currentUserkeyword, setCurrentUserkeyword] = useState("")
    let [userList, setUsersList] = useState([])
    const updateUsersList = async ()=>{
        const response = await getUsersListAPI(currentUserkeyword.length > 0 ? currentUserkeyword: undefined, sessionUserId)
        usersListSetter(response.data.users_list)
        setUsersList(response.data.users_list)
    }
    const onLetterInput = (e)=>{
        if (!(e.target.value.length > currentUserkeyword.length && userList.length === 0)){
            setCurrentUserkeyword(e.target.value)
        }
    }
    useEffect(()=>{
        console.log('Actualizando lista de usuarios')
        updateUsersList()
    }, [currentUserkeyword])
    return (
        <input placeholder="Busca a un usuario" className="users-filter-input" type="text" onChange={onLetterInput}/>
    )
}
UserFilter.propTypes = {
    usersListSetter  : PropTypes.func.isRequired,
    sessionUserId : PropTypes.number.isRequired
}