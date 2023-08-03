import { getUsersListAPI } from "../api/getUsersList.api"
import {PropTypes} from "prop-types"
import { useEffect, useState } from "react"



/**
 * Filtro de busqueda de usuarios en el UsersInterface -> UsersList
 * @param {Number} session_user_id id del usuario de la sesion activa 
 * @param {Function} usersListSetter 
 * @param {String} accessToken token de acceso del usuario para hacer las consultas a la api 
 */
export function UserFilter({session_user_id, usersListSetter, accessToken}){
    let [currentUserkeyword, setCurrentUserkeyword] = useState("")
    let [userList, setUsersList] = useState([])
    const updateUsersList = async ()=>{
        const response = await getUsersListAPI(session_user_id, currentUserkeyword.length > 0 ? currentUserkeyword: undefined, accessToken)
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