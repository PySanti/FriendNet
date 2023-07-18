import { Chat } from "./Chat"
import { UsersList } from "./UsersList"
import { PropTypes } from "prop-types"
import "../styles/UsersInterface.css"

/**
 *  Interfaz de chat con los usuarios
 * @param {Array} usersList lista de usuarios de la pagina
 * @param {Function} onUserButtonClick funcion que se ejecutara cuando se presione un UserButton
 * @param {Number} session_user_id Id de usuario de la sesion activa
 * @param {Object} clickedUser Objeto con datos del usuario clicado (puede ser null)
 * @param {Function} onMsgSending funcion que se enviara cuando se mande un mensaje al clickedUser
 */
export function UsersInterface({usersList, onUserButtonClick, session_user_id, clickedUser, messagesHistorial, onMsgSending}){
    return (
        <div className="users-interface-container">
            {usersList && 
                <>
                    <UsersList usersList={usersList} onClickEvent={onUserButtonClick}/>
                    <Chat chatingUser={clickedUser} messages={messagesHistorial} session_user_id={session_user_id} onMsgSending={onMsgSending}/>
                </>
            }
        </div>
    ) 
}


UsersInterface.propTypes = {
    usersList : PropTypes.object,
    onUserButtonClick : PropTypes.func.isRequired,
    session_user_id : PropTypes.number.isRequired,
    clickedUser : PropTypes.object,
    messagesHistorial : PropTypes.object,
    onMsgSending : PropTypes.func.isRequired,
}

UsersInterface.defaultProps ={
    usersList : undefined,
    clickedUser : undefined,
    messagesHistorial : undefined
}