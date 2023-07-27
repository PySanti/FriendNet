import { getUsersListAPI } from "../api/getUsersList.api"
import { useForm } from "react-hook-form"
import {PropTypes} from "prop-types"



/**
 * Filtro de busqueda de usuarios en el UsersInterface -> UsersList
 * @param {Number} session_user_id id del usuario de la sesion activa 
 * @param {Function} usersListSetter 
 */
export function UserFilter({session_user_id, usersListSetter}){
    let {handleSubmit, register} = useForm()
    const onLetterInput = handleSubmit(async (data)=>{
        const response = await getUsersListAPI(session_user_id, data.userKeyword.length > 0 ? data.userKeyword : undefined)
        usersListSetter(response.data.users_list)
    })
    return (
        <form className="users-filter-form" onSubmit={onLetterInput}>
            <input placeholder="Busca a un usuario" className="users-filter-input" type="text" {...register("userKeyword")}/>
        </form>
    )
}
UserFilter.propTypes = {
    session_user_id : PropTypes.number.isRequired,
    usersListSetter  : PropTypes.func.isRequired,
}