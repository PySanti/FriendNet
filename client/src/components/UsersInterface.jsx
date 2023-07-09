import { Chat } from "./Chat"
import { FormatedUsersList } from "./FormatedUsersList"

export function UsersInterface({usersList, onUserButtonClick, session_user_id, clickedUser, messagesHistorial, onMsgSending}){
    return (
        <div className="users-interface-container">
            {usersList && 
                <>
                    <FormatedUsersList usersList={usersList} onClickEvent={onUserButtonClick}/>
                    <Chat chatingUser={clickedUser} messages={messagesHistorial} session_user_id={session_user_id} onMsgSending={onMsgSending}/>
                </>
            }
        </div>
    ) 
}