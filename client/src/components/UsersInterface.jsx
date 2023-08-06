import { Chat } from "./Chat"
import { UsersList } from "./UsersList"
import { PropTypes } from "prop-types"
import "../styles/UsersInterface.css"

/**
 *  Interfaz de chat con los usuarios
 * @param {Array} usersList lista de usuarios de la pagina
 * @param {Function} onUserButtonClick funcion que se ejecutara cuando se presione un UserButton
 * @param {Number} sessionUserId Id de usuario de la sesion activa
 * @param {Object} clickedUser Objeto con datos del usuario clicado (puede ser null)
 * @param {Function} onMsgSending funcion que se enviara cuando se mande un mensaje al clickedUser
 * @param {Array} chatGlobeList lista de ids de los usuarios con globe en la usersList
 * @param {Function} usersListSetter setter de lista de usuarios a usar con filtro
 */
export function UsersInterface({usersList, onUserButtonClick, sessionUserId, clickedUser, messagesHistorial, onMsgSending, chatGlobeList, usersListSetter}){
    return (
        <div className="users-interface-container">
            {usersList && 
                <>
                    <UsersList 
                        usersList={usersList} 
                        onClickEvent={onUserButtonClick} 
                        chatGlobeList={chatGlobeList} 
                        usersListSetter={usersListSetter} 
                        sessionUserId={sessionUserId}/>
                    <Chat 
                        chatingUser={clickedUser} 
                        messages={messagesHistorial} 
                        sessionUserId={sessionUserId} 
                        onMsgSending={onMsgSending}/>
                </>
            }
        </div>
    ) 
}


UsersInterface.propTypes = {
    usersList : PropTypes.oneOfType([PropTypes.array, PropTypes.boolean]),
    onUserButtonClick : PropTypes.func.isRequired,
    sessionUserId : PropTypes.number.isRequired,
    clickedUser : PropTypes.object,
    messagesHistorial : PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onMsgSending : PropTypes.func.isRequired,
    chatGlobeList : PropTypes.array,
    usersListSetter : PropTypes.func.isRequired,
}

UsersInterface.defaultProps ={
    usersList : undefined,
    clickedUser : undefined,
    messagesHistorial : undefined,
    chatGlobeList : undefined
}