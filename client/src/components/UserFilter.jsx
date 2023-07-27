import { getUsersListAPI } from "../api/getUsersList.api"
import { useForm } from "react-hook-form"
import {PropTypes} from "prop-types"
import { useEffect, useState } from "react"



/**
 * Filtro de busqueda de usuarios en el UsersInterface -> UsersList
 * @param {Number} session_user_id id del usuario de la sesion activa 
 * @param {Function} usersListSetter 
 */
export function UserFilter({session_user_id, usersListSetter}){
    let [currentUserkeyword, setCurrentUserkeyword] = useState("")
    let [userList, setUsersList] = useState([])
    const updateUsersList = async ()=>{
        const response = await getUsersListAPI(session_user_id, currentUserkeyword.length > 0 ? currentUserkeyword: undefined)
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
    session_user_id : PropTypes.number.isRequired,
    usersListSetter  : PropTypes.func.isRequired,
}