import { getUsersListAPI } from "../api/getUsersList.api"
import {PropTypes} from "prop-types"
import { useEffect, useState } from "react"



/**
 * Filtro de busqueda de usuarios
 * @param {Array} initialUsersList
 * @param {Function} usersListSetter 
 * @param {String} sessionUserId 
 */
export function UserFilter({initialUsersList, usersListSetter, sessionUserId}){
    let [currentUserkeyword, setCurrentUserkeyword] = useState("")
    let [userList, setUsersList] = useState(initialUsersList ? initialUsersList : [])
    // state creado para evitar que se cargue la lista de usuarios la primera vez que se monta el home
    let [filterInitializer, setFilterInitializer] = useState(false) 
    const updateUsersList = async ()=>{
        console.log('Actualizando lista de usuarios desde userFilter')
        const response = await getUsersListAPI(currentUserkeyword.length > 0 ? currentUserkeyword: undefined, sessionUserId)
        usersListSetter(response.data.users_list)
        setUsersList(response.data.users_list)
    }
    const onLetterInput = (e)=>{
        // optimizacion
        if (e.target.value.length <= currentUserkeyword.length || userList.length > 0){
            setCurrentUserkeyword(e.target.value)
            if (!filterInitializer){
                setFilterInitializer(true)
            }
        }
    }
    useEffect(()=>{
        if(filterInitializer){
            updateUsersList()
        }
    }, [currentUserkeyword])
    return (
        <input placeholder="Busca a un usuario" className="users-filter-input" type="text" onChange={onLetterInput}/>
    )
}
UserFilter.propTypes = {
    usersListSetter  : PropTypes.func.isRequired,
    sessionUserId : PropTypes.number.isRequired,
    initialUsersList : PropTypes.array.isRequired
}